import { NoUserError, ApiError } from "lib/errorHandler";
import { authMiddleware } from "lib/middleware";
import createHandler from "lib/routeHandler";
import { Favour, User } from "models";
import { createFavourValidation } from "models/Favour";

const handler = createHandler();

/* ========== CREATE FAVOUR ========== */

handler.post(authMiddleware, async (req, res) => {
  const {
    debtor,
    recipient,
    rewards,
    initialEvidence,
  } = await createFavourValidation.validate(req.body, { abortEarly: false });

  const user = await User.findById(req.userId);
  if (!user) {
    throw new NoUserError();
  }

  const debtorData = await User.findById(debtor);
  if (!debtorData) {
    throw new NoUserError();
  }
  console.log(debtorData);
  const recipientData = await User.findById(recipient);
  if (!recipientData) {
    throw new NoUserError();
  }
  console.log(recipientData);
  if (!initialEvidence && user._id === recipientData._id) {
    throw new ApiError(400, "Evidence required");
  }

  const newFavour = await Favour.create({
    creator: user.asEmbedded(),
    debtor: debtorData.asEmbedded(),
    recipient: recipientData.asEmbedded(),
    rewards: rewards as Map<string, number>,
    initialEvidence: initialEvidence as string, // <-- Subject to change
  });
  console.log(newFavour);
  res.status(201).json(newFavour);
});

/* ========== READ FAVOUR ========== */

/* Get All Requests */
// handler.get("/", async (req, res) => {
//   const allRequests = await Favour.find();
//   res.json(allRequests);
// });

export default handler;
