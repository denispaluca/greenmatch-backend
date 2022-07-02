import PowerPlantModel from "../models/powerplant";
import PPAModel from "../models/ppa"
import { PPABuy, PPAQuery } from "../types/ppa"
import { startOfNextMonth } from "../utils/time";
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
  };

  if (powerplantId) {
    query.powerplantId = powerplantId;
  }

  return PPAModel.find(query).lean();
}

export const get = (id: string, userId: string, role: 'supplier' | 'buyer') => {
  const query: PPAQuery = {}
  if (role === 'supplier') {
    query.supplierId = userId;
  } else {
    query.buyerId = userId;
  };
  return PPAModel.findOne({
    _id: id,
    ...query
  }).lean();
}

export const cancel = (id: string, supplierId: string) => {
  return PPAModel.findOneAndUpdate(
    {
      _id: id,
      supplierId,
    },
    {
      canceled: true
    },
    {
      new: true
    }
  ).lean();
}

const durationMap = {
  5: { 'durations.five': true },
  10: { 'durations.ten': true },
  15: { 'durations.fifteen': true }
}
export const buy = async (buyerId: string, buyOrder: PPABuy) => {
  const { powerplantId, amount, duration } = buyOrder;

  const powerplant = await PowerPlantModel.findOneAndUpdate(
    {
      _id: powerplantId,
      live: true,
      availableCapacity: { $gte: amount },
      ...durationMap[duration]
    },
    {
      $inc: { availableCapacity: -amount }
    },
    {
      new: true
    }
  ).lean();

  if (!powerplant) {
    throw Error('Could update the Power Plant');
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

  // create subscription

  const ppa = await PPAModel.create({
    buyerId,
    ...buyOrder,
    supplierId: powerplant.supplierId,
    price: powerplant.price,
    startDate: startOfNextMonth(),
    stripePriceId: price.id
  });

  return ppa.toObject();
}

