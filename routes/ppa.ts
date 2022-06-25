import express from "express";
import * as PPAController from '../controllers/ppa';

const router = express.Router();
router.get('/', PPAController.list);
router.post('/', PPAController.buy)
router.get('/:id', PPAController.get);
router.patch('/:id', PPAController.cancel);

export default router;