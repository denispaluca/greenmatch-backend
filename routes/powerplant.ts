import express from "express";
import * as PowerPlantController from '../controllers/powerplant';

const router = express.Router();

router.get('/', PowerPlantController.list);
router.post('/', PowerPlantController.create);
router.get('/:id', PowerPlantController.get);
router.patch('/:id', PowerPlantController.update);
router.delete('/:id', PowerPlantController.remove);


export default router;