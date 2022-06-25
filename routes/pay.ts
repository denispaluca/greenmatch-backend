import express from "express";
const router = express.Router();

import * as StripeController from "../controllers/stripe";

router.post("/customer", StripeController.createCustomer); // create customer on stripe
router.post("/clientSecret", StripeController.clientSecret); // create setup intent and return client secret
router.post("/subscribe", StripeController.subscribe); // create subscription with payment method from setup intent
// TODO: route to create product

export default router