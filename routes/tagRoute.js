import { Router } from "express";
import tagController from "../controller/tagController.js";
import { tokenValidator } from "../middleware/auth/tokenValidator.js";
import authorizeRoles from "../middleware/auth/authRoleValidator.js";

const tagRouter = Router();

tagRouter.get("/", tagController.getAllTags); // GET: Retrieve all tags

// Admin only.
tagRouter.post(
    "/",
    tokenValidator("JWT"),
    authorizeRoles([1]),
    tagController.addTag,
); // POST: Create a new tag
tagRouter.put(
    "/",
    tokenValidator("JWT"),
    authorizeRoles([1]),
    tagController.editTag,
); // PUT: Update a tag
tagRouter.delete(
    "/",
    tokenValidator("JWT"),
    authorizeRoles([1]),
    tagController.removeTag,
); // DELETE: Delete a tag

export default tagRouter;
