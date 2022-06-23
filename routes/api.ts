import express from "express";
import authRouter from './auth';
import powerplantRouter from './powerplant';

const router = express.Router();
router.use('/auth', authRouter);
router.use('/powerplants', powerplantRouter);

export default router;