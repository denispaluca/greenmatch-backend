import type { Request, Response } from 'express';

const stripe = require('stripe')('sk_test_51LDTGtLY3fwx8Mq4A840X9p9iAHTomTWfygNJauif6MY7kCZRtXFtSyFvKXtglFYfw6vqmq2RoqmiIPFrx3Wzg7v00pQymjPfD');

/* export const paymentIntent = async (req: Request, res: Response) => {
    const intent = await stripe.setupIntents.create({
        /* amount: 2000,
        currency: 'eur',
        setup_future_usage: 'off_session',
        customer: 'cus_Lvgp9qes1LHMR3',
        payment_method_types: ['sepa_debit'],
        // Verify your integration in this guide by including this parameter
        /* metadata: { integration_check: 'sepa_debit_accept_a_payment' },
    });
    res.send(intent);
}; */

export const customer = async (req: Request, res: Response) => {
    const customer = await stripe.customers.create({
        'email': 'test@test.de',
        'name': 'tester',
    });
    res.send(customer);
};

export const subscribe = async (req: Request, res: Response) => {
    const subscription = await stripe.subscriptions.create({
        customer: 'cus_Lvgp9qes1LHMR3',
        items: [{ price: 'price_1LDTWwLY3fwx8Mq4aQkG4GfA' }],
        payment_behavior: 'default_incomplete',
        payment_settings: { save_default_payment_method: 'on_subscription' },
        expand: ['latest_invoice.payment_intent'],
        cancel_at: '1662019200',
        billing_cycle_anchor: '1656662400',
        //proration_behavior: 'none',
        //default_payment_method: 'pm_1LEZM8LY3fwx8Mq4d3wF5OIn',
    });
    console.log('Subscription successfully set up');
    res.send({ client_secret: subscription.latest_invoice.payment_intent.client_secret });
};