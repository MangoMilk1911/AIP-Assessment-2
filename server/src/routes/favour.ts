import express from "express";
import { authMiddleware } from "../middleware";
import { Favour } from "../models";
import { Reward } from "../models/Favour";
import User, { IUser } from "../models/User";

const favourRouter = express.Router();

interface FavourBody {
  debtor: IUser;
  recipient: IUser;
  rewards: Reward;
}

/* ========== CREATE FAVOUR ========== */
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

/* ========== UPDATE FAVOUR ========== */
favourRouter.post("/update", async (req, res) => {});

/* ========== DELETE FAVOUR ========== */
favourRouter.post("/delete", async (req, res) => {});

export default favourRouter;
