import express from "express";
import { body, param, validationResult } from "express-validator";
import { authMiddleware } from "../middleware";
import { Request, User } from "../models";
import { ContributionSchema } from "../models/Request";
import { ApiError, NoUserError } from "../utils/errorHandler";

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
    .isLength({ min: 10, max: 90 }).withMessage("Title must be between 10 to 90 characters.").bail()
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
  "/",
  authMiddleware,
  ...requestCreateValidation,
  async (req, res) => {
    validationResult(req).throw();
    const { title, description, initRewards } = req.body as RequestBody;

    // find user from mongodb by their userid
    const user = await User.findById(req.userId);
    if (!user) throw new NoUserError();

    // create initial contributions array with current user as first contributor
    const contributions: ContributionSchema[] = [
      {
        user: user.asEmbedded(),
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

requestRouter.get("/:id", authMiddleware);

// ==================== Update Request ====================

interface updateRequestBody {
  title?: string;
  description?: string;
  rewards?: Map<string, number>;
}

// prettier-ignore
const requestUpdateValidation = [
  param("id").isMongoId().withMessage("Lol thats not a mongoId").bail(),
  body("title")
    .exists({ checkFalsy: true }).withMessage("Title must not be empty.").bail()
    .isLength({ min: 10, max: 90 }).withMessage("Title must be between 10 to 90 characters.").bail()
    .trim()
    .escape(),
  body("description")
    .exists({ checkFalsy: true }).withMessage("Please provide a short explanation of the Request.").bail()
    .isLength({ min: 20, max: 500 }).withMessage("Description must be between 20 to 500 characters.").bail()
    .trim()
    .escape(),
];

requestRouter.put(
  "/:id",
  authMiddleware,
  ...requestUpdateValidation,
  async (req, res) => {
    validationResult(req).throw();
    const { id } = req.params;
    const { title, description } = req.body as updateRequestBody;

    const request = await Request.findById(id);
    if (!request) {
      throw new ApiError(400, "Request Object not found.");
    }

    const isCreator = req.userId === request.contributions[0].user._id;
    if (!isCreator) {
      throw new ApiError(403, "You are not the Father!");
    }

    try {
      request.set({
        title,
        description,
      });
      const updatedRequest = await request.save();
      res.json(updatedRequest);
    } catch (error) {
      throw error;
    }
  }
);

// ==================== Update Request Rewards by Contribution ====================

interface updateContributionBody {
  newRewards: Map<string, number>;
}

const updateContributionValidation = [
  param("id").isMongoId().withMessage("Lol thats not a mongoId").bail(),
];

requestRouter.put(
  "/:id/contributions",
  authMiddleware,
  ...updateContributionValidation,
  async (req, res) => {
    const { id } = req.params;
    const { newRewards } = req.body as updateContributionBody;

    const request = await Request.findById(id);
    if (!request) {
      throw new ApiError(400, "Request Object not found.");
    }

    //get the contribution of the logged in user by going through Contributions[] in the Request Object
    const usersContribution = request.contributions.filter((contribution) => {
      return contribution.user._id === req.userId;
    })[0];
    if (!usersContribution) {
      throw new ApiError(403, "You are not an existing contributor.");
    }

    //Save the index of the user by passing in the contribution object
    const userContributionIndex = request.contributions.indexOf(
      usersContribution
    );

    // check if new rewards is empty before adding it to contriubtion
    // if empty then delete whole contribution

    //save the newRewards from the request to the correct index
    request.contributions[userContributionIndex].rewards = newRewards;
    const result = await request.save();
    res.json(result);
  }
);

// ==================== Add NEW Rewards to existing Request ====================
interface additionalRewardsBody {
  additionalRewards: Map<string, number>;
}

requestRouter.post("/:id/contributions", authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { additionalRewards } = req.body as additionalRewardsBody;

  const user = await User.findById(req.userId);
  if (!user) throw new NoUserError();

  const request = await Request.findById(id);
  if (!request) {
    throw new ApiError(400, "Request Object not found.");
  }

  //try to find a contribution that already has the logged in user
  const usersContribution = request.contributions.filter((contribution) => {
    return contribution.user._id === req.userId;
  })[0];
  if (usersContribution) {
    throw new ApiError(403, "You are already an existing contributor.");
  }

  // create new contribution object
  const newContribution: ContributionSchema = {
    user: user.asEmbedded(),
    rewards: additionalRewards,
  };

  //add the contribution to the array of contributions
  request.contributions.push(newContribution);
  const result = await request.save();
  res.json(result);
});

// ==================== Delete Request ====================
requestRouter.delete("/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;

  const request = await Request.findById(id);
  if (!request) {
    throw new ApiError(400, "Request Object not found.");
  }

  if (!(req.userId === request.contributions[0].user._id)) {
    throw new ApiError(403, "You are not the father!");
  }

  request.remove();
  request.save();
  res.json("Request was successfully removed!");
});

// ==================== GET all Requests ====================
requestRouter.get("/", async (req, res) => {
  const allRequests = await Request.find({});
  res.json(allRequests);
});

export default requestRouter;
