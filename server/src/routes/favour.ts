import express from "express";
import { body, validationResult } from "express-validator";
import { authMiddleware } from "../middleware";
import { Favour } from "../models";
import User, { UserSchema } from "../models/User";
import { ApiError } from "../utils/errorHandler";

const favourRouter = express.Router();

// Loop over element, if not number or over a limit, return false, else true

/* ========== CREATE FAVOUR ========== */

interface FavourBody {
  debtor: UserSchema["_id"];
  recipient: UserSchema["_id"];
  rewards: Map<string, number>;
  initialEvidence: Buffer;
}

const favourCreateValidation = [
  body("debtor")
    .exists({ checkFalsy: true })
    .withMessage("Debtor must not be empty.")
    .bail(),
  body("recipient")
    .exists({ checkFalsy: true })
    .withMessage("Recipient must not be empty.")
    .bail(),
  body("rewards")
    .exists()
    .withMessage("Rewards must not be empty BRUH.")
    .bail(),
  body("initialEvidence"),
];

favourRouter.post(
  "/",
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

    if (rewards)
      if (!initialEvidence && user._id === recipientData._id) {
        // This goes in validation (debtor != recipient)
        // if (debtorData._id === recipientData._id) {
        //   throw new ApiError(400, "Yo mums a hoe");
        // }

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

/* ========== READ FAVOUR ========== */

/* Get All Requests */
favourRouter.get("/", async (req, res) => {
  const allRequests = await Favour.find({});
  res.json(allRequests);
});

/* ========== UPDATE FAVOUR ========== */

/* Update Favour By Reward */
interface editFavourRewards {
  rewards: Map<string, number>;
}

const editRewardsValidation = [
  body("favourId")
    .isMongoId()
    .withMessage("Favour not found in MongoDB")
    .bail(),
];

favourRouter.put(
  "/:id",
  authMiddleware,
  ...editRewardsValidation,
  async (req, res) => {
    validationResult(req).throw();
    const { favourId } = req.params;
    const { rewards } = req.body as editFavourRewards;

    const favour = await Favour.findById(favourId);
    if (!favour) {
      throw new ApiError(400, "Favour not found.");
    }

    const isCreator = req.userId === favour.creator._id;
    if (!isCreator) {
      throw new ApiError(
        400,
        "You must be the creator to edit a favour, niggerino"
      );
    }

    try {
      favour.set({
        rewards,
      });
      const updateFavour = await favour.save();
      res.json(updateFavour);
    } catch (error) {
      throw error;
    }
  }
);

/* Update Favour By Evidence */

interface editFavourEvidence {
  evidence: Buffer;
}

const editEvidenceValidation = [body("evidence")];

favourRouter.post(
  ":id/evidence",
  authMiddleware,
  ...editEvidenceValidation,
  async (req, res) => {
    validationResult(req).throw();
    const { favourId } = req.params;
    const { evidence } = req.body as editFavourEvidence;

    const favour = await Favour.findById(favourId);
    if (!favour) {
      throw new ApiError(400, "Favour not found.");
    }

    const isCreator = req.userId === favour.creator._id;
    if (!isCreator) {
      throw new ApiError(
        400,
        "You must be the creator to edit a favour, niggerino"
      );
    }

    try {
      favour.set({
        evidence,
      });
      const updateFavour = await favour.save();
      res.json(updateFavour);
    } catch (error) {
      throw error;
    }
  }
);

/* ========== DELETE FAVOUR ========== */

favourRouter.post("/:id", async (req, res) => {
  const { id } = req.params;

  const favour = await Favour.findById(id);
  if (!favour) {
    throw new ApiError(400, "Request Object not found.");
  }

  if (!(req.userId === favour.creator._id)) {
    throw new ApiError(403, "What are you doing step-bro?!");
  }

  favour.remove();
  favour.save();
  res.json("POOF!! I just gobbled your cock");
});

export default favourRouter;
