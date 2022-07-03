import express from "express";
const router = express.Router();

import * as AuthMiddleware from "../middlewares/auth";
import * as AuthController from "../controllers/auth";

router.post("/login", AuthController.login); // login
router.post("/register", AuthController.register); // register a new user
router.get("/me", AuthMiddleware.checkAuthentication, AuthController.me); // get own username, requires a logged in user
router.get("/logout", AuthMiddleware.checkAuthentication, AuthController.logout); // logout user
router.get("/setupIntent", AuthMiddleware.checkAuthentication, AuthController.setupIntent); // create setup intent

export default router;
