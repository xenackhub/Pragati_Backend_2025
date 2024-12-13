import { Router } from "express";
import userController from "../controller/organizerController.js";
import { tokenValidator } from "../middleware/auth/tokenValidator.js";

const userRouter = Router();
userRouter.use(tokenValidator);

//Still controllers have to be written, so for now I'm just linking it...
userRouter.put("/editOrganizer", userController.editOrganizer);
userRouter.delete("/removeOrganizer",userController.removeOrganizer);
userRouter.post("/addOrganizer",userController.addOrganizer);

export default userRouter