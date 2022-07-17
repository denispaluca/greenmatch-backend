import express from "express";
import * as NotificationController from "../controllers/notification";
import { checkAuthentication } from "../middlewares/auth";

const router = express.Router();

router.get("/", checkAuthentication, NotificationController.list);
router.patch("/:id", checkAuthentication, NotificationController.read);

export default router