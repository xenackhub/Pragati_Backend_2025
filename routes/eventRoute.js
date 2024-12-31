import { Router } from "express";
import { tokenValidator } from "../middleware/auth/tokenValidator.js";
import eventController from "../controller/eventController.js";
import authorizeRoles from "../middleware/auth/authRoleValidator.js"

const eventRouter = Router();

eventRouter.post("/", tokenValidator("JWT"), eventController.addEvent);
eventRouter.get("/all", eventController.getAllEvents);
eventRouter.get("/:eventID(\\d+)", eventController.getEventDetailsByID);
eventRouter.get("/club/:clubID(\\d+)", eventController.getEventForClub);
eventRouter.get("/user/:userID(\\d+)", eventController.getEventsRegisteredByUser);
eventRouter.delete("/", tokenValidator("JWT"), authorizeRoles([1]), eventController.deleteEvent);

export default eventRouter;
