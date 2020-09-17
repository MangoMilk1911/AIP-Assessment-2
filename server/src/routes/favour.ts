import express from "express";
import { Favour } from "../models";
import { RewardClass } from "../models/Reward";
import { UserClass } from "../models/User";

const favourRouter = express.Router();

interface FavourBody {
  debtor: UserClass;
  recipient: UserClass;
  rewards: RewardClass;
}

favourRouter.post("/create", async (req, res) => {
  const { debtor, recipient, rewards } = req.body as FavourBody;

  // Try to create new favour
  try {
    const newFavour = await Favour.create({
      debtor,
      recipient,
      rewards,
    });

    res.json(newFavour);
  } catch (error) {
    //TO DO
  }
});

favourRouter.post("/delete", async (req, res) => {});

favourRouter.post("/confirm", async (req, res) => {});

export default favourRouter;
