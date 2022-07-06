import express from "express";
import * as UnameController from "../controllers/email";

const router = express.Router();

router.get("/:id", UnameController.checkAvailability); // check whether email is already in use or not

export default router