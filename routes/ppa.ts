import express, { RequestHandler } from "express";
import * as PPAController from '../controllers/ppa';

const router = express.Router();
const mockMiddleWare: RequestHandler = (req, res, next) => {
  (req as any).buyerId = '62b19996acae4107a14709d6';
  next();
}

router.get('/', mockMiddleWare, PPAController.list);
router.post('/', mockMiddleWare, PPAController.buy)
router.get('/:id', mockMiddleWare, PPAController.get);
router.patch('/:id', mockMiddleWare, PPAController.cancel);

export default router;