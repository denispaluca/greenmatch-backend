import express from "express";
import authRouter from './auth';
import powerplantRouter from './powerplant';
import offerRouter from './offer';
import ppaRouter from './ppa';

const router = express.Router();
router.use('/auth', authRouter);
router.use('/powerplants', powerplantRouter);
router.use('/offers', offerRouter);
router.use('/ppas', ppaRouter);

export default router;