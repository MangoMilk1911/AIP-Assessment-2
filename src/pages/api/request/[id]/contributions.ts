import { authMiddleware } from "lib/middleware";
import { Request, User } from "models";
import {
  addContributionValidation,
  ContributionSchema,
  updateContributionValidation,
} from "models/Request";
import { ApiError, NoUserError } from "lib/errorHandler";
import createHandler from "lib/routeHandler";

const handler = createHandler();

// ==================== Update Request Rewards by Contribution ====================

handler.put(authMiddleware, async (req, res) => {
  const data = await updateContributionValidation.validate(
    {
      ...req.query,
      ...req.body,
    },
    { abortEarly: false }
  );

  const { id, newRewards } = data;
  const request = await Request.findById(id);

  if (!request) {
    throw new ApiError(400, "Request Object not found.");
  }

  //get the contribution of the logged in user by going through Contributions[] in the Request Object
  const usersContribution = request.contributions.filter((contribution) => {
    return contribution.user._id === req.userId;
  })[0];
  if (!usersContribution) {
    throw new ApiError(403, "You are not an existing contributor.");
  }

  //Save the index of the user by passing in the contribution object
  const userContributionIndex = request.contributions.indexOf(
    usersContribution
  );

  request.contributions[userContributionIndex].rewards.clear();
  console.log(request.contributions[1].rewards);

  // prettier-ignore
  request.contributions[userContributionIndex].rewards = newRewards as Map<string,number>;
  console.log(request.contributions[1].rewards);

  const result = await request.save();

  res.json(result);
});

// ==================== Add NEW Rewards to existing Request ====================

handler.post(authMiddleware, async (req, res) => {
  const data = await addContributionValidation.validate(
    {
      ...req.query,
      ...req.body,
    },
    { abortEarly: false }
  );

  const { id, additionalRewards } = data;

  const user = await User.findById(req.userId);
  if (!user) throw new NoUserError();

  const request = await Request.findById(id);
  if (!request) {
    throw new ApiError(400, "Request Object not found.");
  }

  //try to find a contribution that already has the logged in user
  const usersContribution = request.contributions.filter((contribution) => {
    return contribution.user._id === req.userId;
  })[0];
  if (usersContribution) {
    throw new ApiError(403, "You are already an existing contributor.");
  }

  // create new contribution object
  const newContribution: ContributionSchema = {
    user: user.asEmbedded(),
    rewards: additionalRewards as Map<string, number>,
  };

  //add the contribution to the array of contributions
  request.contributions.push(newContribution);
  const result = await request.save();

  res.json(result);
});

export default handler;
