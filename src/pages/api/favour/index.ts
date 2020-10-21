import { NoUserError, ApiError } from "lib/errorHandler";
import { authMiddleware } from "lib/middleware";
import createHandler from "lib/routeHandler";
import { Favour, User } from "models";
import { favourValidation } from "lib/validator/schemas";
import createValidator from "lib/validator";

const handler = createHandler();
const validate = createValidator(favourValidation);

// =================== Get User Favours =====================

handler.get(authMiddleware, async (req, res) => {
  const { page = 1, limit = 6 } = req.query;
  const userDebtorFavours = await Favour.find({ "debtor._id": req.userId })
    .limit(Number(limit))
    .skip((Number(page) - 1) * Number(limit));
  const userRecipientFavours = await Favour.find({ "recipient._id": req.userId })
    .limit(Number(limit))
    .skip((Number(page) - 1) * Number(limit));
  const numberOfFavours = await Favour.countDocuments();
  if (!userDebtorFavours || !userRecipientFavours)
    throw new ApiError(503, "Favours could not be loaded.");
  res.json({
    userDebtorFavours,
    userRecipientFavours,
    currentPage: page,
    totalPages: Math.ceil(numberOfFavours / Number(limit)),
  });
});

// =================== Create Favour =====================

handler.post(authMiddleware, async (req, res) => {
  const { debtor, recipient, rewards, initialEvidence } = await validate(req, "create");

  /**
   * Avoid redundant read
   */

  // Find the current user from db
  const userData = await User.findById(req.userId);
  if (!userData) throw new NoUserError();

  // Find the debtor from db
  const debtorData = await User.findById(debtor);
  if (!debtorData) throw new ApiError(400, "No debtor with that ID exists.");

  // Find the recipient form db
  const recipientData = await User.findById(recipient);
  if (!recipientData) throw new ApiError(400, "No recipient with that ID exists.");

  if (!initialEvidence && userData._id === recipientData._id)
    throw new ApiError(400, "Evidence required");

  // Write new favour to db
  const newFavour = await Favour.create({
    creator: userData.asEmbedded(),
    debtor: debtorData.asEmbedded(),
    recipient: recipientData.asEmbedded(),
    rewards,
    initialEvidence,
  });

  res.status(201).json(newFavour);
});

export default handler;
