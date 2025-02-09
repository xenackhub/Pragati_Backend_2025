import notificationController from "../controller/notificationController";
import { Router } from "express";

const notificationRouter = Router();

/**
 * @swagger
 * /api/notification/:
 *   get:
 *     summary: Get all current notifications
 *     tags:
 *       - Notifications
 *     responses:
 *       200:
 *         description: Fetched all notifications successfully
 *       500:
 *         description: A problem from our side :(
 */
notificationRouter.get("/", notificationController.getAllNotifications);

export default notificationRouter;
