import express from "express";
const router = express.Router();

import * as StripeController from "../controllers/stripe";

//router.get("/payment-intent", StripeController.paymentIntent); // create payment intent
router.get("/customer", StripeController.customer); // create customer
//router.post("/payment-standard", StripeController.paymentStandard); // set as standard payment method
router.get("/subscribe", StripeController.subscribe); // subscribe

export default router