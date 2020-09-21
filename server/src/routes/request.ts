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
  //initRewards needs validation
  //desciprtion
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

    if (!user) {
      throw new ApiError(400, "User not found in MongoDB.");
    }

    //create an array of contributors for the contributors attribute on the Request object
    const contributors: Contributor[] = [
      {
        userId: user._id,
        displayName: user.displayName,
        photoURL: user.photoURL,
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

// ==================== Read Request ====================
// ==================== Update Request ====================

/**
 * find request by ID,
 * get edit variables from request
 * get new Contributor or delete rewards from existing contributors
 *
 */

// ==================== Delete Request ====================

export default requestRouter;
