import express from "express";
import * as PPAController from '../controllers/ppa';
import { checkAuthentication } from "../middlewares/auth";

const router = express.Router();

router.get('/', checkAuthentication, PPAController.list);
router.post('/', checkAuthentication, PPAController.buy)
router.get('/:id', checkAuthentication, PPAController.get);
router.patch('/:id', checkAuthentication, PPAController.cancel);

export default router;