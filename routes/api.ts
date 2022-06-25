import express from "express";
import authRouter from './auth';
import payRouter from './pay';

const router = express.Router();
router.use('/auth', authRouter);
router.use('/stripe', payRouter);

export default router;