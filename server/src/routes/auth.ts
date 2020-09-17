import express from "express";
import argon2 from "argon2";
import passport from "../utils/passport";
import { User } from "../models";

import { MongoError } from "mongodb";
import { RepeatPasswordError, UniqueFieldMongoError } from "../errors";

const authRouter = express.Router();

// ==================== Login ====================

interface LoginBody {
  username: string;
  password: string;
}

authRouter.post("/login", async (req, res) => {
  const { username, password } = req.body as LoginBody;

  // Check is user exists
  const foundUser = await User.findOne({ username }).select("+password");
  if (!foundUser) {
    return res.status(401).json({
      errors: ["Incorrect username or password"],
    });
  }

  // Check if correct password
  const isCorrectPassword = await argon2.verify(foundUser.password!, password);
  if (!isCorrectPassword) {
    return res.status(401).json({
      errors: ["Incorrect username or password"],
    });
  }

  // Send user data without password & token
  res.json({
    user: foundUser.withoutPassword(),
    token: foundUser.generateJWT(),
  });
});

// ==================== Register ====================

interface RegisterBody {
  username: string;
  email: string;
  password: string;
  repeatPassword: string;
}

authRouter.post("/register", async (req, res) => {
  const {
    username,
    email,
    password,
    repeatPassword,
  } = req.body as RegisterBody;

  try {
    // Check if both password match
    if (password !== repeatPassword) {
      throw new RepeatPasswordError();
    }

    // Hash user password before storing in DB
    const hashedPass = await argon2.hash(password);

    // Try to write new user
    const newUser = await User.create({
      username,
      email,
      password: hashedPass,
    });

    res.json({
      user: newUser.withoutPassword(),
      token: newUser.generateJWT(),
    });
  } catch (error) {
    if (error instanceof MongoError && error.code === 11000) {
      // If username or email taken
      // Cast as custom error since mongo doesn't have a unqiue validation error class
      const { keyValue } = error as UniqueFieldMongoError;
      const field = Object.keys(keyValue)[0];
      const value = keyValue[field];

      res.status(400).json({
        errors: [{ field, msg: `${value} is already taken.` }],
      });
    } else if (error instanceof RepeatPasswordError) {
      // If passwords are different
      res.status(400).json({
        errors: [{ field: "repeatPassword", msg: error.message }],
      });
    } else {
      // 501 Big Bad error that we don't know how to handle
      res.status(501).json({ error: error.message });
    }
  }
});

// ==================== User Profile ====================

authRouter.get(
  "/user",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json(req.user);
  }
);

export default authRouter;
