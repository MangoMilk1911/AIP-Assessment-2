import express from "express";
import { Request, User } from "../models";
import { ContributionSchema } from "../models/Request";
import { ApiError } from "../utils/errorHandler";

const requestRouter = express.Router();

// -- Create

interface RequestBody {
  title: string;
  description: string;
  initRewards: Map<string, number>;
}

requestRouter.post("/create", authMiddleware, async (req, res) => {
  const { title, description, initRewards } = req.body as RequestBody;

  //find user from mongodb by their userid (needs a throw error to double check)
  const user = await User.findById(req.userId);

  // find user from mongodb by their userid
  const user = await User.findById(req.userId);

  // making sure user is not undefined
  if (!user) {
    throw new ApiError(400, "User not found in MongoDB.");
  }

  // create initial contributions array with current user as first contributor
  const contributions: ContributionSchema[] = [
    {
      user: user.asEmbedded(),
      rewards: initRewards,
    },
  ];

  //create an array of contributors for the contributors attribute on the Request object
  const contributors: Contributor[] = [
    {
      _id: user._id,
      displayName: user.displayName,
      rewards: initRewards,
    },
  ];

  //Actually create request on mongodb
  try {
    const newRequest = await Request.create({
      title,
      contributions,
      description,
    });
    res.status(201).json(newRequest);
  } catch (error) {
    if (true) {
      res.status(503).json(error.message);
    }
  }
});

export default requestRouter;
