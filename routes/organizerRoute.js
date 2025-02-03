import { Router } from "express";
import organizerController from "../controller/organizerController.js";
import { tokenValidator } from "../middleware/auth/tokenValidator.js";
import authorizeRoles from "../middleware/auth/authRoleValidator.js";

const organizerRouter = Router();
organizerRouter.use(tokenValidator("JWT"), authorizeRoles([1]));

organizerRouter.put("/editOrganizer", organizerController.editOrganizer);
organizerRouter.delete("/removeOrganizer", organizerController.removeOrganizer);
organizerRouter.post("/addOrganizer", organizerController.addOrganizer);

export default organizerRouter;
