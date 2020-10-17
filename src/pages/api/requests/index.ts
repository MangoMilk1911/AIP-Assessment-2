import { NoUserError } from "lib/errorHandler";
import { authMiddleware } from "lib/middleware";
import createHandler from "lib/routeHandler";
import createValidator from "lib/validator";
import { Request, User } from "models";
import { requestValidation } from "models/Request";
import { ApiError } from "next/dist/next-server/server/api-utils";

const handler = createHandler();
const validate = createValidator(requestValidation);

// ==================== Get all Requests ====================

handler.get(async (req, res) => {
  const allRequests = await Request.find();
  if (!allRequests) throw new ApiError(503, "Requests couldn't be loaded!");
  res.json(allRequests);
});

// ==================== Create Request ====================

handler.post(authMiddleware, async (req, res) => {
  const { title, description, rewards } = await validate(req, "create");

  // Try to find user by their ID
  const user = await User.findById(req.userId);
  if (!user) throw new NoUserError();

  // Create initial contributions with current user as first contributor
  const contributions = {
    [req.userId]: {
      user: user.asEmbedded(),
      rewards,
    },
  };

  const newRequest = await Request.create({
    title,
    description,
    contributions,
    owner: user.asEmbedded(),
  });

  res.status(201).json(newRequest);
});

export default handler;
