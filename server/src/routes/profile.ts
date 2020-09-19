import express from "express";
import { authMiddleware } from "../middleware";
import { User } from "../models";
import { auth } from "../utils/firebase";
import { body, validationResult } from "express-validator";
import { ApiError } from "../utils/errorHandler";

const profileRouter = express.Router();

// ==================== User Profile ====================

profileRouter.get("/me", authMiddleware, async (req, res) => {
  const user = await User.findById(req.userId);
  res.json(user);
});

// ==================== Create New Profile ====================

interface RegisterBody {
  email: string;
  displayName: string;
  photoURL?: string;
}

// prettier-ignore
const createValidation = [
  body("email")
    .exists({ checkFalsy: true }).withMessage("'email' must not be empty.").bail()
    .isEmail().withMessage("Invalid email address."),
  body("displayName")
    .exists({ checkFalsy: true }).withMessage("'displayName' must not be empty.").bail()
    .isString().withMessage("Display name must be a string.").bail()
    .isLength({ min: 4, max: 15 }).withMessage("Display name must be between 4 to 15 characters long")
    .escape(),
  body("photoURL")
    .optional()
    .isURL().withMessage("Photo URL must be a valid URL.")
];

profileRouter.post(
  "/create",
  authMiddleware,
  ...createValidation,
  async (req, res) => {
    validationResult(req).throw();

    const { email, displayName, photoURL } = req.body as RegisterBody;

    // Don't create accoutn if user isn't in firebase auth
    try {
      await auth.getUser(req.userId);
    } catch (error) {
      throw new ApiError(400, "No User with that ID exists in Firebase.");
    }

    const newUser = await User.create({
      _id: req.userId,
      email,
      displayName,
      photoURL,
    });

    res.status(201).json(newUser);
  }
);

export default profileRouter;
