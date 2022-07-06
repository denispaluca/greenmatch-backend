import type { Request, Response } from 'express';

const stripe = require('stripe')('sk_test_51LDTGtLY3fwx8Mq4A840X9p9iAHTomTWfygNJauif6MY7kCZRtXFtSyFvKXtglFYfw6vqmq2RoqmiIPFrx3Wzg7v00pQymjPfD');

export const createCustomer = async (req: Request, res: Response) => {
    // check if the body of the request contains all necessary properties
    const { email, name } = req.body;
    if (!email)
        return res.status(400).json({
            error: "Bad Request",
            message: "The request body must contain an email property",
        });
    if (!name)
        return res.status(400).json({
            error: "Bad Request",
            message: "The request body must contain an name property",
        });

    const customer = await stripe.customers.create({
        'email': req.body.email,
        'name': req.body.name,
    });
    res.send(customer);
};

/* 
* A SetupIntent guides you through the process of setting up and saving a customer's payment credentials for future payments. 
* For example, you could use a SetupIntent to set up and save your customer's card without immediately collecting a payment. 
* Later, you can use PaymentIntents to drive the payment flow. 
*/
export const setupIntent = async (req: Request, res: Response) => {
    // check if the body of the request contains all necessary properties
    const { customer } = req.body;
    if (!customer)
        return res.status(400).json({
            error: "Bad Request",
            message: "The request body must contain a customer property",
        });

    const setupIntent = await stripe.setupIntents.create({
        payment_method_types: ['sepa_debit'],
        customer: req.body.customer,
    });
    res.send(setupIntent);
};

/*
* items: the price id of the purchased ppa
* cancel_at: unix timestamp when the subscription should stop
* billing_cycle_anchor: unix timestamp when the subscription should start
* proration_behavior: do not proportionally charge the customer before the billing cycle starts
*/
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
    res.send(subscription);
};

/* 
* Creates product with price and return price object
* unit_amount: monthly amount in cents
*/
export const ppa = async (req: Request, res: Response) => {
    // check if the body of the request contains all necessary properties
    const { name, unit_amount } = req.body;
    if (!name)
        return res.status(400).json({
            error: "Bad Request",
            message: "The request body must contain a name property",
        });

    if (!unit_amount)
        return res.status(400).json({
            error: "Bad Request",
            message: "The request body must contain a unit_amount property",
        });

    // create product
    const product = await stripe.products.create({
        name: req.body.name,
    });
    // create price and bind it to product
    const price = await stripe.prices.create({
        unit_amount: req.body.unit_amount,
        currency: 'eur',
        recurring: { interval: 'month' },
        product: product.id,
    });
    res.send(price);
};