import express from "express";
import * as EmailController from "../controllers/email";

const router = express.Router();

router.get("/:id", EmailController.checkAvailability); // check whether email is already in use or not

export default router