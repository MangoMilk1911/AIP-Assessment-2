import express from "express";
import { auth } from "../utils/firebase";

const authRouter = express.Router();

// ==================== User Profile ====================

authRouter.get("/user", async (req, res) => {
  const accessToken = req.headers.authorization?.split(" ")[1];

  if (!accessToken) {
    return res.sendStatus(401);
  }

  try {
    res.json(await auth.verifyIdToken(accessToken));
  } catch (error) {
    // Invalid access token
    res.sendStatus(403);
  }
});

export default authRouter;
