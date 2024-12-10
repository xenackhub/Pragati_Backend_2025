import { Router } from "express";
import authRouter from "./authRoute.js";
import eventRouter from "./eventRoute.js";

const router = Router();

router.use("/auth", authRouter);
router.use("/event", eventRouter);

export default router;
