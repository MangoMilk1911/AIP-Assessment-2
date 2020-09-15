import express from "express";
import { Favour } from "../models";

const favourRouter = express.Router();

favourRouter.post("/create", async (req, res) => {
  const { debtor, recipient, dateCreated, rewards, proof } = req.body;

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
export default favourRouter;
