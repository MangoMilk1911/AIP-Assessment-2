import { NoUserError } from "lib/errorHandler";
import { authMiddleware } from "lib/middleware";
import createHandler from "lib/routeHandler";
import { Request, User } from "models";
import { ContributionSchema, createRequestValidation } from "models/Request";

const handler = createHandler();

// ==================== Create Request ====================

handler.post(authMiddleware, async (req, res) => {
  const {
    title,
    description,
    initRewards,
  } = await createRequestValidation.validate(req.body, { abortEarly: false });

  // find user from mongodb by their userid
  const user = await User.findById(req.userId);
  if (!user) throw new NoUserError();

  // create initial contributions array with current user as first contributor
  const contributions: ContributionSchema[] = [
    {
      user: user.asEmbedded(),
      rewards: initRewards as Map<string, number>,
    },
  ];

  // actually create request on mongodb
  const newRequest = await Request.create({
    title,
    contributions,
    description,
  });
  res.status(201).json(newRequest);
});

// ==================== GET all Requests ====================
handler.get(async (req, res) => {
  const allRequests = await Request.find();
  res.json(allRequests);
});

export default handler;
