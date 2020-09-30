import { ApiError, NoUserError } from "lib/errorHandler";
import { authMiddleware } from "lib/middleware";
import createHandler from "lib/routeHandler";
import { Request, User } from "models";
import { ContributionSchema, requestValidation } from "models/Request";

const handler = createHandler();

// ==================== Update Request Rewards by Contribution ====================

handler.put(authMiddleware, async (req, res) => {
  const { id, rewards } = await requestValidation.validate(
    {
      ...req.query,
      ...req.body,
    },
    { abortEarly: false }
  );

  const request = await Request.findById(id);
  if (!request) throw new ApiError(400, "No Request with that ID exists.");

  // Try to find current users contribution
  const contribution = request.contributions.find((contr) => contr.user._id === req.userId);
  if (!contribution) {
    // Add a new contribution if none found
    const userData = await User.findById(req.userId);
    if (userData) throw new NoUserError();

    request.contributions.push({
      user: userData.asEmbedded(),
      rewards,
    });
  } else {
    // Otherwise overwrite existing
    contribution.rewards = rewards;
  }

  // Write the update to the DB
  const result = await request.save();

  res.status(200).json(result);
});

// ==================== Add NEW Rewards to existing Request ====================

// handler.post(authMiddleware, async (req, res) => {
//   const data = await addContributionValidation.validate(
//     {
//       ...req.query,
//       ...req.body,
//     },
//     { abortEarly: false }
//   );

//   const { id, additionalRewards } = data;

//   const user = await User.findById(req.userId);
//   if (!user) throw new NoUserError();

//   const request = await Request.findById(id);
//   if (!request) {
//     throw new ApiError(400, "Request Object not found.");
//   }

//   //try to find a contribution that already has the logged in user
//   const usersContribution = request.contributions.filter((contribution) => {
//     return contribution.user._id === req.userId;
//   })[0];
//   if (usersContribution) {
//     throw new ApiError(403, "You are already an existing contributor.");
//   }

//   // create new contribution object
//   const newContribution: ContributionSchema = {
//     user: user.asEmbedded(),
//     rewards: additionalRewards as Map<string, number>,
//   };

//   //add the contribution to the array of contributions
//   request.contributions.push(newContribution);
//   const result = await request.save();

//   res.json(result);
// });

export default handler;
