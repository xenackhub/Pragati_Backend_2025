import { Router } from "express";

const authRouter = Router();

authRouter.post("/login", (req, res) => {
  console.log("request recieved!");
  return res.status(200).json({ MESSAGE: "Hello from server" });
});

export default authRouter;
