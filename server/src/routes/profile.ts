import express from "express";
import { authMiddleware } from "../middleware";
import { User } from "../models";
import { auth } from "../utils/firebase";
import { MongoError } from "mongodb";

const profileRouter = express.Router();

// ==================== User Profile ====================

profileRouter.get("/me", authMiddleware, async (req, res) => {
  const user = await User.findById(req.userId);
  res.json(user);
});

// ==================== Create New Profile ====================

interface RegisterBody {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
}

profileRouter.post("/create", async (req, res) => {
  const { uid, email, displayName, photoURL } = req.body as RegisterBody;

  if (!uid) {
    return res.status(400).json("No User ID provided.");
  }

  // Only register users that exist with auth provider
  try {
    await auth.getUser(uid);
  } catch (error) {
    return res.status(400).json("No User with that ID exists on firebase.");
  }

  // Try to create new user db entry
  try {
    const newUser = await User.create({
      _id: uid,
      email,
      displayName,
      photoURL,
    });

    res.status(201).json(newUser);
  } catch (error) {
    // Duplicate field error
    if (error instanceof MongoError && error.code === 11000) {
      res.status(400).json("This account has already been created.");
    } else {
      res.status(503).json(error.message);
    }
  }
});

export default profileRouter;
