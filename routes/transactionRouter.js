import { Router } from "express";
import transactionController from "../controller/transactionController.js";
import { tokenValidator } from "../middleware/auth/tokenValidator.js";

const transactionRouter = Router();

transactionRouter.post("/verify", 
    tokenValidator("JWT"), 
    transactionController.verifyTransactionController);

export default transactionRouter;