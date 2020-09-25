import express from "express";
import { validationResult } from "express-validator";
import { authMiddleware } from "../middleware";
import { User } from "../models";
import { ApiError } from "../utils/errorHandler";
import { auth } from "../utils/firebase";

const profileRouter = express.Router();

// ==================== User Profile ====================

profileRouter.get("/me", authMiddleware, async (req, res) => {
  const user = await User.findById(req.userId);
  res.json(user);
});

// ==================== Create New Profile ====================

/**
 * An API call to this route should be made immediately after a
 * user first signs up on the website to finish creating their
 * account!
 */
profileRouter.post("/", authMiddleware, async (req, res) => {
  validationResult(req).throw();

  let user = await auth.getUser(req.userId);
  const { uid, email, displayName, photoURL } = user;

  // Don't create user account data twice
  const userData = await User.findById(uid);
  if (userData) {
    throw new ApiError(400, "This account has already been created.");
  }

  // `email` & `displayName` will always be defined
  const newUser = await User.create({
    _id: uid,
    email: email!,
    displayName: displayName!,
    photoURL,
  });

  res.status(201).json(newUser);
});

export default profileRouter;
