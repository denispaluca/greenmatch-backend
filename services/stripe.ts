import dotenv from 'dotenv';
import UserModel from '../models/user';
import { getEndDate } from '../utils/time';


// load stripe
dotenv.config();
const stripe = require('stripe')(process.env.STRIPE_SK);

/*
* items: the price id of the purchased ppa
* cancel_at: unix timestamp when the subscription should stop
* billing_cycle_anchor: unix timestamp when the subscription should start
* proration_behavior: do not proportionally charge the customer before the billing cycle starts
*/
export const subscribe = async (ppa: any) => {
    const buyer = await UserModel.findOne({ "_id": ppa.buyerId }).lean()
    const anchorUnix: string = String(ppa.startDate.getTime() / 1000);
    const cancelAtUnix: string = String(getEndDate(ppa.duration).getTime() / 1000);

    await stripe.subscriptions.create({
        customer: buyer!.stripeCustId,
        items: [{ price: ppa.stripePriceId }],
        payment_behavior: 'default_incomplete',
        expand: ['latest_invoice.payment_intent'],
        cancel_at: cancelAtUnix,
        billing_cycle_anchor: anchorUnix,
        proration_behavior: 'none',
        default_payment_method: ppa.stripePaymentMethod,
    });
};