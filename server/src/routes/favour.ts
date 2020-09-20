import express from "express";
import { authMiddleware } from "../middleware";
import { Favour } from "../models";
import { RewardClass } from "../models/Reward";
import User, { UserClass } from "../models/User";

const favourRouter = express.Router();

interface FavourBody {
  debtor: UserClass;
  recipient: UserClass;
  rewards: RewardClass;
}

favourRouter.post("/create", authMiddleware, async (req, res) => {
  const { debtor, recipient, rewards } = req.body as FavourBody;

  const user = await User.findById(req.userId);

  // Try to create new favour
  try {
    const newFavour = await Favour.create({
      debtor,
      recipient,
      rewards,
    });

    res.status(201).json(newFavour);

    res.json(newFavour);
  } catch (error) {
    //TO DO
  }
});

favourRouter.post("/delete", async (req, res) => {});

favourRouter.post("/confirm", async (req, res) => {});

export default favourRouter;
