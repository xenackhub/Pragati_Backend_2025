import { Router } from 'express';
import profileController from "../controller/profileController.js";
import { tokenValidator } from '../middleware/auth/tokenValidator.js';

const profileRouter = Router();

profileRouter.get("/:userID(\\d+)",profileController.getUserProfile);
profileRouter.put("/edit", profileController.editProfile);

export default profileRouter;
