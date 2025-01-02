import { Router } from "express";
import { tokenValidator } from "../middleware/auth/tokenValidator.js";
import loginSetter from "../middleware/auth/loginSetter.js";
import eventController from "../controller/eventController.js";

const eventRouter = Router();

eventRouter.post("/", tokenValidator("JWT"), eventController.addEvent);
eventRouter.get("/all", loginSetter,eventController.getAllEvents);
eventRouter.get("/:eventID(\\d+)", eventController.getEventDetailsByID);
eventRouter.get("/club/:clubID(\\d+)", eventController.getEventForClub);
eventRouter.get("/user/:userID(\\d+)", eventController.getEventsRegisteredByUser);


export default eventRouter;
