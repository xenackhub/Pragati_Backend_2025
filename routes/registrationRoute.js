import { Router } from "express";
import registrationController from "../controller/registrationController.js";
import { tokenValidator } from "../middleware/auth/tokenValidator.js";

const registrationRouter = Router();

/**
 * @swagger
 * /api/registration/event:
 *   post:
 *     summary: Register a user or team for an event.
 *     tags:
 *       - Registration
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userID:
 *                 type: string
 *                 description: ID of the user
 *               eventID:
 *                 type: integer
 *                 description: ID of the event
 *               totalMembers:
 *                 type: integer
 *                 description: Total number of members
 *               teamName:
 *                 type: string
 *                 description: Team name
 *               teamMembers:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: List of team members (optional)
 *               memberRoles:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Roles of team members (optional)
 *     responses:
 *       200:
 *         description: Registration successful
 *       400:
 *         description: Invalid input
 *       500:
 *         description: A problem from our side :(
 */
registrationRouter.post(
    "/event",
    tokenValidator("JWT"),
    registrationController.addRegistration,
);

export default registrationRouter;
