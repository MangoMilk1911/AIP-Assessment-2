import express from "express";
import { body, validationResult } from "express-validator";
import { authMiddleware } from "../middleware";
import { Request, User } from "../models";
import { Contribution } from "../models/Request";
import { ApiError } from "../utils/errorHandler";

const requestRouter = express.Router();

// ==================== Create Request ====================

interface RequestBody {
  title: string;
  description: string;
  initRewards: Map<string, number>;
}

// prettier-ignore
const requestCreateValidation = [
  body("title")
    .exists({ checkFalsy: true }).withMessage("Title must not be empty.").bail()
    .isLength({ max: 90 }).withMessage("Title less than 90 characters.").bail()
    .trim()
    .escape(),
  body("description")
    .exists({ checkFalsy: true }).withMessage("Please provide a short explanation of the Request.").bail()
    .isLength({ min: 20, max: 500 }).withMessage("Description must be between 20 to 500 characters.").bail()
    .trim()
    .escape(),
  body("initRewards")
    .exists().withMessage("Incorrect Reward Format.").bail()
    // need to add if check for specific reward
];

requestRouter.post(
  "/create",
  authMiddleware,
  ...requestCreateValidation,
  async (req, res) => {
    validationResult(req).throw();
    const { title, description, initRewards } = req.body as RequestBody;

    // find user from mongodb by their userid
    const user = await User.findById(req.userId);

    // making sure user is not undefined
    if (!user) {
      throw new ApiError(400, "User not found in MongoDB.");
    }

    // de-structuring user object from Mongo
    const { _id, email, displayName, photoURL } = user;

    // create an array of contributors for the contributors attribute on the Request object
    const contributions: Contribution[] = [
      {
        user: {
          _id,
          email,
          displayName,
          photoURL,
        },
        rewards: initRewards,
      },
    ];

    // actually create request on mongodb
    const newRequest = await Request.create({
      title,
      contributions,
      description,
    });
    res.status(201).json(newRequest);
  }
);

// ==================== Read an existing Request ====================

requestRouter.post("/search", authMiddleware);

// ==================== Update Request ====================

/**
 * find request by ID,
 * get edit variables from request
 * get new Contributor or delete rewards from existing contributors
 *
 */

// ==================== Delete Request ====================

export default requestRouter;
