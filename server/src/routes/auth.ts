import express from "express";
import { User } from "../models";
import { BetterMongoError } from "../types";
const authRouter = express.Router();

authRouter.get("/login", async (req, res) => {
  res.json("logged in!");
});

authRouter.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  // TODO: Encrypt password

  try {
    const newUser = await User.create({
      username,
      email,
      password,
    });

    res.json(newUser);
  } catch (error) {
    const dupValues = (error as BetterMongoError).keyValue;
    const field = Object.keys(dupValues)[0];
    const value = dupValues[field];

    res.status(406).json({
      errors: [{ field, msg: `${value} is already taken.` }],
    });
  }
});

export default authRouter;
