import { Router } from "express";
import authRouter from "./authRoute.js";
import eventRouter from "./eventRoute.js";
import tagRouter from "./tagRoute.js";
import organizerRouter from "./organizerRoute.js";

const router = Router();

router.use("/auth", authRouter);
router.use("/event", eventRouter);
router.use('/auth',authRouter);
router.use('/tag', tagRouter); 
router.use('/org',organizerRouter)

export default router;
