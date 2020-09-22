import express from "express";
import { authMiddleware } from "../middleware";
import { Favour } from "../models";
import User, { UserSchema } from "../models/User";
import { body, validationResult } from "express-validator";
import { ApiError } from "../utils/errorHandler";

const favourRouter = express.Router();

/* ========== CREATE FAVOUR ========== */

interface FavourBody {
  debtor: UserSchema["_id"];
  recipient: UserSchema["_id"];
  rewards: Map<string, number>;
  initialEvidence: Buffer;
}

const favourCreateValidation = [
  body("debtor").exists(),
  body("recipient").exists(),
  body("rewards").exists(),
  body("initialEvidence"),
];

favourRouter.post(
  "/create",
  authMiddleware,
  ...favourCreateValidation,
  async (req, res) => {
    validationResult(req).throw();

    const {
      debtor,
      recipient,
      rewards,
      initialEvidence,
    } = req.body as FavourBody;

    const user = await User.findById(req.userId);
    if (!user) {
      throw new ApiError(400, "User not found in MongoDB");
    }

    const debtorData = await User.findById(debtor);
    if (!debtorData) {
      throw new ApiError(400, "Debtor not found in MongoDB");
    }

    const recipientData = await User.findById(recipient);
    if (!recipientData) {
      throw new ApiError(400, "Recipient not found in MongoDB");
    }

    // This goes in validation (debtor != recipient)
    // if (debtorData._id === recipientData._id) {
    //   throw new ApiError(400, "Yo mums a hoe");
    // }

    if (!initialEvidence && user._id === recipientData._id) {
      throw new ApiError(400, "Evidence required");
    }

    const newFavour = await Favour.create({
      creator: user.asEmbedded(),
      debtor: debtorData.asEmbedded(),
      recipient: recipientData.asEmbedded(),
      rewards,
      initialEvidence,
    });

    res.status(201).json(newFavour);
  }
);

/* ========== UPDATE FAVOUR ========== */
favourRouter.post("/update", async (req, res) => {});

/* ========== DELETE FAVOUR ========== */
favourRouter.post("/delete", async (req, res) => {});

export default favourRouter;
