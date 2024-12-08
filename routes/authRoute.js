import { Router } from "express";
import authController from "../controller/authController.js";

const authRouter = Router();

authRouter.post("/login", authController.login);
authRouter.post("/forgotPassword", authController.forgotPassword);

authRouter.post("/signup", authController.signup);

export default authRouter;
