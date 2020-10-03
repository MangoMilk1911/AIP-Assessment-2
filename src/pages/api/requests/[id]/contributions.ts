import { ApiError } from "lib/errorHandler";
import { authMiddleware } from "lib/middleware";
import createHandler from "lib/routeHandler";
import createValidator from "lib/validator";
import { Contribution, Request, User } from "models";
import { requestValidation } from "models/Request";

const handler = createHandler();
const validate = createValidator(requestValidation);

// ==================== Update Request contribution ====================

handler.put(authMiddleware, async (req, res) => {
  const { id, rewards } = await validate(req);

  const request = await Request.findById(id);
  if (!request) throw new ApiError(400, "No Request with that ID exists.");

  // Don't let owners remove their contribution, they must delete the request altogether
  if (request.owner._id === req.userId && !rewards)
    throw new ApiError(400, "Request owner cannot remove their contribution.");

  // Use `findOrCreate` to ensure a contributions bucket always exists
  const { doc: contrBucket } = await Contribution.findOrCreate({ _id: request._id });

  // Find the current user data to embed
  const user = await User.findById(req.userId);

  // Update the new rewards if any otherwise remove the contribution
  if (rewards) {
    contrBucket.contributions.set(user._id, { user: user.asEmbedded(), rewards });
  } else {
    contrBucket.contributions.delete(user._id);
  }

  // Sync contribution count on reqeust doc
  request.noOfContributors = contrBucket.contributions.size;

  // Create new session for the transaction
  const session = await Contribution.db.startSession();

  // Write the updates to the DB in a transaction
  await session.withTransaction(async () => {
    await contrBucket.save();
    await request.save();
  });

  session.endSession();
  res.status(200).json({
    ...request.toJSON(),
    contributions: contrBucket.contributions,
  });
});

export default handler;
