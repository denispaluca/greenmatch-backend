import express, { RequestHandler } from "express";
import * as PowerPlantController from '../controllers/powerplant';

const router = express.Router();

const mockMiddleWare: RequestHandler = (req, res, next) => {
  (req as any).supplierId = '62b19996acae4107a14709d6';
  next();
}

router.get('/', mockMiddleWare, PowerPlantController.list);
router.post('/', mockMiddleWare, PowerPlantController.create);
router.get('/:id', mockMiddleWare, PowerPlantController.get);
router.patch('/:id', mockMiddleWare, PowerPlantController.update);
router.delete('/:id', mockMiddleWare, PowerPlantController.remove);


export default router;