import express from "express";
import argon2 from "argon2";
import { User } from "../models";
import passport from "../utils/passport";

import { MongoError } from "mongodb";
import { UniqueFieldMongoError } from "../utils/errors";

const authRouter = express.Router();

authRouter.post("/log", passport.authenticate("local"), (req, res) => {
  res.json(req.user);
});

authRouter.post("/logout", (req, res) => {
  req.logout();
  res.end();
});

authRouter.get("/user", (req, res) => {
  console.log(req.user);

  res.json(req.user);
});

/**
 * LOGIN
 *
 * Required POST params
 * @param username  account username
 * @param password  account password
 */
authRouter.post("/login", async (req, res) => {
  const { username, password } = req.body;

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

  // Send user data without password
  res.json(foundUser?.withoutPassword());
});

/**
 * REGISTER
 *
 * Required POST params
 * @param username  a unique username
 * @param email     a unique email address
 * @param password  account password
 */
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
