import { NoUserError } from "lib/errorHandler";
import { authMiddleware } from "lib/middleware";
import createHandler from "lib/routeHandler";
import { Request, User } from "models";
import { ContributionSchema, requestValidation } from "models/Request";

const handler = createHandler();

// ==================== Get all Requests ====================

handler.get(async (req, res) => {
  const allRequests = await Request.find();
  res.json(allRequests);
});

// ==================== Create Request ====================

handler.post(authMiddleware, async (req, res) => {
  const { title, description, rewards } = await requestValidation.validate(req.body, {
    abortEarly: false,
    strict: true,
    context: { create: true },
  });

  // Try to find user by their ID
  const user = await User.findById(req.userId);
  if (!user) throw new NoUserError();

  // Create initial contributions array with current user as first contributor
  const contributions: ContributionSchema[] = [
    {
      user: user.asEmbedded(),
      rewards,
    },
  ];

  // Write new request to DB
  const newRequest = await Request.create({
    title,
    description,
    contributions,
  });

  res.status(201).json(newRequest);
});

export default handler;
