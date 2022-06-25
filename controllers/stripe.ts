import type { Request, Response } from 'express';

const stripe = require('stripe')('sk_test_51LDTGtLY3fwx8Mq4A840X9p9iAHTomTWfygNJauif6MY7kCZRtXFtSyFvKXtglFYfw6vqmq2RoqmiIPFrx3Wzg7v00pQymjPfD');

export const createCustomer = async (req: Request, res: Response) => {
    const customer = await stripe.customers.create({
        'email': req.body.email,
        'name': req.body.name,
    });
    res.send(customer);
};

export const clientSecret = async (req: Request, res: Response) => {
    const setupIntent = await stripe.setupIntents.create({
        payment_method_types: ['sepa_debit'],
        customer: req.body.customer,
    });
    const clientSecret = setupIntent.client_secret;
    res.send({ "client_secret": clientSecret });
};

export const subscribe = async (req: Request, res: Response) => {
    const subscription = await stripe.subscriptions.create({
        customer: req.body.customer,
        items: [{ price: req.body.price }],
        payment_behavior: 'default_incomplete',
        expand: ['latest_invoice.payment_intent'],
        cancel_at: req.body.cancel_at,
        billing_cycle_anchor: req.body.billing_cycle_anchor,
        proration_behavior: 'none',
        default_payment_method: req.body.default_payment_method,
    });
    console.log('Subscription Successfully Set Up');
};