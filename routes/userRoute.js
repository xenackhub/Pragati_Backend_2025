import { Router } from "express";
import userController from "../controller/userController.js";

const userRouter = Router();
userRouter.use(tokenValidator);

//Still controllers have to be written, so for now I'm just linking it...
userRouter.put("/editOrganiser", userController.editOrganiser);
userRouter.delete("/removeOrganiser",userController.removeOrganiser);
userRouter.post("/addOrganiser",userController.addOrganiser);
userRouter.put("/accomodationUpdate",userController.accomodationUpdate);

export default userRouter