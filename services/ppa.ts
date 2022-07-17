import PowerPlantModel from "../models/powerplant";
import PPAModel from "../models/ppa";
import { PPABuy, PPAQuery } from "../types/ppa";
import { startOfNextMonth } from "../utils/time";
import { subscribe } from "../services/stripe";
import * as MailService from "../services/mailer";
import * as NotificationService from "../services/notification";
import dotenv from 'dotenv';

// load stripe
dotenv.config();
const stripe = require('stripe')(process.env.STRIPE_SK);


export const list = (userId: string, role: 'supplier' | 'buyer', powerplantId?: string) => {
  const query: PPAQuery = {}
  if (role === 'supplier') {
    query.supplierId = userId;
  } else {
    query.buyerId = userId;
  }

  if (powerplantId) {
    query.powerplantId = powerplantId;
  }

  return PPAModel.find(query).lean();
};

export const get = (id: string, userId: string, role: "supplier" | "buyer") => {
  const query: PPAQuery = {};
  if (role === "supplier") {
    query.supplierId = userId;
  } else {
    query.buyerId = userId;
  }
  return PPAModel.findOne({
    _id: id,
    ...query,
  }).lean();
};

export const cancel = async (id: string, supplierId: string) => {
  const canceledPPA = await PPAModel.findOneAndUpdate(
    {
      _id: id,
      supplierId,
    },
    {
      canceled: true,
    },
    {
      new: true,
    }
  ).lean();

  if (canceledPPA) {
    await stripe.subscriptions.del(
      canceledPPA.stripeSubscriptionId
    );

    await PowerPlantModel.findOneAndUpdate(
      {
        _id: canceledPPA.powerplantId,
        supplierId: supplierId
      },
      {
        $inc: { availableCapacity: canceledPPA.amount }
      });

    await NotificationService.create(canceledPPA);
  }

  return canceledPPA;
};

const durationMap = {
  5: { "durations.five": true },
  10: { "durations.ten": true },
  15: { "durations.fifteen": true },
};
export const buy = async (buyerId: string, buyOrder: PPABuy) => {
  const { powerplantId, amount, duration } = buyOrder;

  const powerplant = await PowerPlantModel.findOneAndUpdate(
    {
      _id: powerplantId,
      live: true,
      availableCapacity: { $gte: amount },
      ...durationMap[duration],
    },
    {
      $inc: { availableCapacity: -amount },
    },
    {
      new: true,
    }
  ).lean();

  if (!powerplant) {
    throw Error("Could update the Power Plant");
  }

  // stripe: create product
  const product = await stripe.products.create({
    name: 'PPA BuyerID: ' + buyerId,
  });

  // stripe: create price and bind it to product
  const price = await stripe.prices.create({
    unit_amount: Math.ceil((powerplant.price * amount * duration) / (12 * duration)),
    currency: 'eur',
    recurring: { interval: 'month' },
    product: product.id,
  });

  const params = {
    buyerId: buyerId,
    stripePriceId: price.id,
    startDate: startOfNextMonth(),
    duration: duration,
    stripePaymentMethod: buyOrder.stripePaymentMethod
  }

  // stripe: create subscription
  const subscription = await subscribe(params);

  const ppa = await PPAModel.create({
    buyerId,
    ...buyOrder,
    supplierId: powerplant.supplierId,
    price: powerplant.price,
    startDate: startOfNextMonth(),
    stripePriceId: price.id,
    stripeSubscriptionId: subscription.id,
    contractURL: 'https://drive.google.com/file/u/0/d/1pSi-MikNLUk84_WYVNEL3nV6ChzbiNWW/preview',
  });

  //Prevent Spammming during testing -> Remove for Demo!!
  //MailService.sendPpaAcknowledgement(buyerId, powerplant, buyOrder);
  return ppa.toObject();
};
