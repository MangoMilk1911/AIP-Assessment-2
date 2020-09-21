//-- Imports which I copied
import express from "express";
import { Request, User } from "../models";
import { authMiddleware } from "../middleware";
import { body, validationResult } from "express-validator";
//-- My own shit imports
import { Contributor } from "../models/Request";
import { ApiError } from "../utils/errorHandler";

const requestRouter = express.Router();

// ==================== Create Request ====================

interface RequestBody {
  title: string;
  description: string;
  initRewards: Map<string, number>;
}

const requestCreateValidation = [
  body("title")
    .exists({ checkFalsy: true })
    .withMessage("Title must not be empty.")
    .trim()
    .escape()
    .isLength({ max: 90 })
    .bail(),
  body("description")
    .exists({ checkFalsy: true })
    .withMessage("Please provide a short explanation of the Request.")
    .trim()
    .escape()
    .isLength({ min: 20, max: 500 })
    .bail(),
  body("initRewards").exists().withMessage("Incorrect Reward Format.").bail(),
];

requestRouter.post(
  "/create",
  authMiddleware,
  ...requestCreateValidation,
  async (req, res) => {
    validationResult(req).throw();
    const { title, description, initRewards } = req.body as RequestBody;

    //find user from mongodb by their userid
    const user = await User.findById(req.userId);

    //Making sure user is not undefined
    if (!user) {
      throw new ApiError(400, "User not found in MongoDB.");
    }

    //de-structuring user object from Mongo
    const { _id, displayName, email, photoURL } = user;

    //create an array of contributors for the contributors attribute on the Request object
    const contributors: Contributor[] = [
      {
        user: {
          _id,
          displayName,
          email,
          photoURL,
        },
        rewards: initRewards,
      },
    ];

    //Actually create request on mongodb
    const newRequest = await Request.create({
      title,
      contributors,
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
