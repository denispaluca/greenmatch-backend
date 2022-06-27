import express from "express";
const router = express.Router();

import * as StripeController from "../controllers/stripe";

router.post("/customer", StripeController.createCustomer); // create customer on stripe
router.post("/setupIntent", StripeController.setupIntent); // create setup intent
router.post("/subscribe", StripeController.subscribe); // creates subscription with payment method from setup intent
router.post("/ppa", StripeController.ppa); // creates PPA product with price

export default router