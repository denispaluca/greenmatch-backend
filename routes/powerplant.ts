import express from "express";
import * as PowerPlantController from '../controllers/powerplant';

const router = express.Router();
router.post('/', PowerPlantController.create);

export default router;