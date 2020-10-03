import { ApiError } from "lib/errorHandler";
import { authMiddleware } from "lib/middleware";
import createHandler from "lib/routeHandler";
import createValidator from "lib/validator";
import Contribution from "models/Contribution";
import Request, { requestValidation } from "models/Request";

const handler = createHandler();
const validate = createValidator(requestValidation);

// ==================== Read a single existing Request ====================

handler.get(async (req, res) => {
  const { id } = await validate(req);

  const request = await Request.findById(id);
  if (!request) throw new ApiError(400, "No Request with that ID exists.");

  const contrBucket = await Contribution.findById(request._id);

  res.json({
    ...request.toJSON(),
    contributions: contrBucket.contributions,
  });
});

// ==================== Update Request Details ====================

handler.put(authMiddleware, async (req, res) => {
  const { id, ...updateBody } = await validate(req);

  const request = await Request.findById(id);
  if (!request) throw new ApiError(400, "No Request with that ID exists.");

  // User is not the owner
  if (request.owner._id !== req.userId)
    throw new ApiError(403, "You do not have permission to perform this action.");

  // Set the local object and then write to db
  request.set(updateBody);
  await request.save();

  res.json(request);
});

// ==================== Delete Request ====================

handler.delete(authMiddleware, async (req, res) => {
  const { id } = await validate(req);

  const request = await Request.findById(id);
  if (!request) throw new ApiError(400, "No Request with that ID exists.");

  // User is not the owner
  if (request.owner._id !== req.userId)
    throw new ApiError(403, "You do not have permission to perform this action.");

  // Create new session for the transaction
  const session = await Request.db.startSession();

  // Delete request and it's contributions bucket
  await session.withTransaction(async () => {
    await request.deleteOne();
    await Contribution.findByIdAndDelete(request._id);
  });

  session.endSession();
  res.status(204).end();
});

export default handler;
