import { Router } from "express";
import authController from "../controller/authController.js";

const authRouter = Router();

authRouter.post("/login", authController.login);
authRouter.post("/forgotPassword", authController.forgotPassword);

authRouter.post("/signup", authController.signup);
authRouter.post("/resetPassword", authController.resetPassword);

export default authRouter;
