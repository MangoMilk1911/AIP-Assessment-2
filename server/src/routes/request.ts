//-- Imports which I copied
import express from "express";
import { Request, User } from "../models";
import { authMiddleware } from "../middleware";
//-- My own shit imports
import { Contributor } from "../models/Request";

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

  //if a userid is not on the request
  if (!user) {
    return res.status(400).json("No user id exists");
  }

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
      contributors,
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
