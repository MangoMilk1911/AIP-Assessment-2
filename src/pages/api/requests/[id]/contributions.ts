import { ApiError, NoUserError } from "lib/errorHandler";
import { authMiddleware } from "lib/middleware";
import createHandler from "lib/routeHandler";
import createValidator from "lib/validator";
import { Request, User } from "models";
import { requestValidation } from "models/Request";

const handler = createHandler();
const validate = createValidator(requestValidation);

// ==================== Update Request Rewards by Contribution ====================

handler.put(authMiddleware, async (req, res) => {
  const { id, rewards } = await validate(req);

  const request = await Request.findById(id);
  if (!request) throw new ApiError(400, "No Request with that ID exists.");

  if (request.owner._id === req.userId && !rewards)
    throw new ApiError(400, "Request owner cannot remove their contribution.");

  const user = await User.findById(req.userId);
  const { contributions } = request;

  if (rewards) {
    contributions.set(user._id, { user: user.asEmbedded(), rewards });
  } else {
    contributions.delete(user._id);
  }

  // Write the update to the DB
  await request.save();
  res.status(200).json(request);
});

export default handler;
