import express from "express";
import * as OfferController from '../controllers/offer';

const router = express.Router();


router.get('/', OfferController.list);
router.get('/:id', OfferController.get);
router.patch('/:id', OfferController.buy);


export default router;