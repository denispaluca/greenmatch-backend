import express from "express";
import * as UnameController from "../controllers/username";

const router = express.Router();

router.get("/:id", UnameController.checkAvailability); // check whether username is already in use or not

export default router