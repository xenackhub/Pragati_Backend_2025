import { Router } from "express";
import tagController from "../controller/tagController.js";

const tagRouter = Router();

tagRouter.post("/add", tagController.addTag);
tagRouter.get("/", tagController.getAllTags);
tagRouter.delete("/remove/:id", tagController.removeTag);
tagRouter.put("/edit/:id", tagController.editTag);

export default tagRouter;