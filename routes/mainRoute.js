import { Router } from "express";
import authRouter from "./authRoute.js";
import tagRouter from "./tagRoute.js";

const router = Router();

router.use('/auth',authRouter);
router.use('/tags', tagRouter); 

export default router;