import express from "express";
import * as PowerPlantController from '../controllers/powerplant';
import { checkAuthentication } from "../middlewares/auth";

const router = express.Router();

router.get('/', checkAuthentication, PowerPlantController.list);
router.post('/', checkAuthentication, PowerPlantController.create);
router.get('/:id', checkAuthentication, PowerPlantController.get);
router.patch('/:id', checkAuthentication, PowerPlantController.update);
router.delete('/:id', checkAuthentication, PowerPlantController.remove);


export default router;