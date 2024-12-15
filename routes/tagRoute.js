import { Router } from "express";
import tagController from "../controller/tagController.js";
import { tokenValidator } from "../middleware/auth/tokenValidator.js";

const tagRouter = Router();

tagRouter.post("/add",tokenValidator, tagController.addTag);
tagRouter.get("/", tagController.getAllTags);
tagRouter.delete("/remove/:id",tokenValidator, tagController.removeTag);
tagRouter.put("/edit/:id", tokenValidator, tagController.editTag);

export default tagRouter;