import { Router } from 'express';
import adminController from "../controller/adminController.js";
import authorizeRoles from '../middleware/auth/authRoleValidator.js';
import { tokenValidator } from '../middleware/auth/tokenValidator.js';

const adminRouter = Router();

adminRouter.use(tokenValidator("JWT"),authorizeRoles([2]))
adminRouter.get("/transactions", adminController.getAllTransactions);

export default adminRouter;
