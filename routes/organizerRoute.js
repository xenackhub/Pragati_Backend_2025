import { Router } from "express";
import organizerController from "../controller/organizerController.js";
import { tokenValidator } from "../middleware/auth/tokenValidator.js";

const userRouter = Router();
userRouter.use(tokenValidator);

//Still controllers have to be written, so for now I'm just linking it...
userRouter.put("/editOrganizer", organizerController.editOrganizer);
userRouter.delete("/removeOrganizer",organizerController.removeOrganizer);
userRouter.post("/addOrganizer",organizerController.addOrganizer);

export default organizerRouter