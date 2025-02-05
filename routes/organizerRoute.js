import { Router } from "express";
import organizerController from "../controller/organizerController.js";
import { tokenValidator } from "../middleware/auth/tokenValidator.js";
import authorizeRoles from "../middleware/auth/authRoleValidator.js";

const organizerRouter = Router();

// GET all organizers.
organizerRouter.get("/", organizerController.allOrganizers);

// PUT, DELETE, POST routes for organizers accessible only to admin.
organizerRouter.put(
    "/",
    tokenValidator("JWT"),
    authorizeRoles([1]),
    organizerController.editOrganizer,
);
organizerRouter.delete(
    "/",
    tokenValidator("JWT"),
    authorizeRoles([1]),
    organizerController.removeOrganizer,
);
organizerRouter.post(
    "/",
    tokenValidator("JWT"),
    authorizeRoles([1]),
    organizerController.addOrganizer,
);

export default organizerRouter;
