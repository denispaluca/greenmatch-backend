import express from "express";
import authRouter from './auth';
import powerplantRouter from './powerplant';
import offerRouter from './offer';

const router = express.Router();
router.use('/auth', authRouter);
router.use('/powerplants', powerplantRouter);
router.use('/offers', offerRouter);

export default router;