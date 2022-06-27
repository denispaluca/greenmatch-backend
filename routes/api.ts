import express from "express";
import authRouter from './auth';
import stripeRouter from './stripe';

const router = express.Router();
router.use('/auth', authRouter);
router.use('/stripe', stripeRouter);

export default router;