import express from "express";
import argon2 from "argon2";
import { User } from "../models";

import { MongoError } from "mongodb";
import { UniqueFieldMongoError } from "../errors";

const authRouter = express.Router();

authRouter.get("/login", async (req, res) => {
  const user = await User.findOne({ username: "ssddfsdd" }).select("+password");

  res.json(user?.withoutPassword());
});

authRouter.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  // Hash user password before storing in DB
  const hashedPass = await argon2.hash(password);

  // Try to write new user
  try {
    const newUser = await User.create({
      username,
      email,
      password: hashedPass,
    });

    res.json(newUser.withoutPassword());
  } catch (error) {
    // If username or email taken
    if (error instanceof MongoError && error.code === 11000) {
      // Cast as custom error since mongo doesn't have a unqiue validation error class
      const { keyValue } = error as UniqueFieldMongoError;
      const field = Object.keys(keyValue)[0];
      const value = keyValue[field];

      res.status(406).json({
        errors: [{ field, msg: `${value} is already taken.` }],
      });
    } else {
      // 501 Big Bad error that we don't know how to handle
      res.status(501).json({ error });
    }
  }
});

export default authRouter;
