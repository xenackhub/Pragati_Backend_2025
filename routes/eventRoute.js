import { Router } from "express";
import { tokenValidator } from "../middleware/auth/tokenValidator.js";
import eventController from "../controller/eventController.js";

const eventRouter = Router();

eventRouter.post("/", tokenValidator, eventController.addEvent);
// eventRouter.get("/club/:clubID", eventController.getEventForClub);
eventRouter.get("/all", eventController.getAllEvents);
eventRouter.get("/:eventID(\\d+)", eventController.getEventDetailsByID);

export default eventRouter;
