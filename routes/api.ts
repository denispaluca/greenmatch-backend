import express from "express";
import authRouter from './auth';
import powerplantRouter from './powerplant';
import offerRouter from './offer';
import ppaRouter from './ppa';
import emailRouter from './email';
import notificationRouter from './notification';

const router = express.Router();
router.use('/auth', authRouter);
router.use('/powerplants', powerplantRouter);
router.use('/offers', offerRouter);
router.use('/ppas', ppaRouter);
router.use('/email', emailRouter);
router.use('/notifications', notificationRouter);

export default router;