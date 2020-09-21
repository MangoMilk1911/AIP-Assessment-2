import express from "express";
import { authMiddleware } from "../middleware";
import { Favour } from "../models";
import { Reward } from "../models/Favour";
import User, { EmbeddedUser, IUser } from "../models/User";
import { body, validationResult } from "express-validator";
import { ApiError } from "../utils/errorHandler";

const favourRouter = express.Router();

/* ========== CREATE FAVOUR ========== */

interface FavourBody {
  debtor: IUser["_id"];
  recipient: IUser["_id"];
  rewards: Reward[];
  initialEvidence?: Buffer;
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

    const { _id, email, displayName, photoURL } = user;

    if (debtorData._id === recipientData._id) {
      throw new ApiError(400, "Yo mums a hoe");
    }

    if (!initialEvidence) {
      if (_id === recipientData._id) {
        throw new ApiError(400, "Evidence required");
      }
    }

    const newFavour = await Favour.create({
      creator: {
        _id,
        email,
        displayName,
        photoURL,
      },
      debtor: {
        _id: debtorData._id,
        email: debtorData.email,
        displayName: debtorData.displayName,
        photoURL: debtorData.photoURL,
      },
      recipient: {
        _id: recipientData._id,
        email: recipientData.email,
        displayName: recipientData.displayName,
        photoURL: recipientData.photoURL,
      },
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
