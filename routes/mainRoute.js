import { Router } from "express";
import authRouter from "./authRoute.js";
import eventRouter from "./eventRoute.js";
import tagRouter from "./tagRoute.js";
import organizerRouter from "./organizerRoute.js";
import adminRouter from "./adminRoute.js";

const router = Router();

router.use("/event", eventRouter);
router.use('/org',organizerRouter);
router.use('/admin', adminRouter);
router.use('/auth',authRouter);
router.use('/tag', tagRouter); 

export default router;
