import { Router } from 'express';
import { getAllTransactions } from '../controller/adminController.js';
import authorizeRoles from '../middleware/auth/authRoleValidator.js';
import { tokenValidator } from '../middleware/auth/tokenValidator.js';

const adminRouter = Router();

adminRouter.get('/transactions',tokenValidator("JWT"),authorizeRoles([1]), getAllTransactions);

export default adminRouter;
