import { Router } from "express";
import authRouter from "./authRoute.js";
import organizerRouter from "./organizerRoute.js";

const router = Router();

router.use('/auth',authRouter);
router.use('/org',organizerRouter)

export default router;