import express from "express";
import { authMiddleware } from "../middleware";
import { auth } from "../utils/firebase";

const authRouter = express.Router();

// ==================== User Profile ====================

authRouter.get("/me", authMiddleware, async (req, res) => {
  const user = await auth.getUser(req.userId);
  res.json(user);
});

export default authRouter;
