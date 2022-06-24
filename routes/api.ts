import express from "express";
import authRouter from './auth';
import usernameRouter from './username';

const router = express.Router();
router.use('/auth', authRouter);
router.use('/username', usernameRouter);

export default router;