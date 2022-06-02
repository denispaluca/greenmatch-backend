import express from "express";
const router = express.Router();

import middlewares from "../middlewares";
import AuthController from "../controllers/auth";

router.post("/login", AuthController.login); // login
router.post("/register", AuthController.register); // register a new user
router.get("/me", middlewares.checkAuthentication, AuthController.me); // get own username, requires a logged in user
router.get("/logout", middlewares.checkAuthentication, AuthController.logout); // logout user

export default router;