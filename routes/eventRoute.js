import { Router } from "express";
import { tokenValidator } from "../middleware/auth/tokenValidator.js";
import loginSetter from "../middleware/auth/loginSetter.js";
import eventController from "../controller/eventController.js";
import authorizeRoles from "../middleware/auth/authRoleValidator.js";

const eventRouter = Router();

eventRouter.post("/", tokenValidator("JWT"), authorizeRoles([1]), eventController.addEvent);
eventRouter.get("/all", loginSetter, eventController.getAllEvents);
eventRouter.get(
    "/:eventID(\\d+)",
    loginSetter,
    eventController.getEventDetailsByID,
);
eventRouter.get(
    "/club/:clubID(\\d+)",
    loginSetter,
    eventController.getEventForClub,
);
eventRouter.get(
    "/user/:id(\\d+)",
    loginSetter,
    eventController.getEventsRegisteredByUser,
);
eventRouter.put("/", tokenValidator("JWT"), authorizeRoles([1]), eventController.editEvent);
eventRouter.put("/toggleStatus", tokenValidator("JWT"), authorizeRoles([1]), eventController.toggleStatus);

export default eventRouter;
