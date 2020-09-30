import { EDESTADDRREQ } from "constants";
import { ApiError, NoUserError } from "lib/errorHandler";
import { authMiddleware } from "lib/middleware";
import createHandler from "lib/routeHandler";
import { Favour } from "models";
import {
  checkIdValidation,
  deleteFavourValidation,
  updateFavourRewardsValidation,
} from "models/Favour";

const handler = createHandler();

/* ========= READ REQUEST ========= */

/* Read single request */

handler.get(authMiddleware, async (req, res) => {
  const data = await checkIdValidation.validate(req.query, {
    abortEarly: false,
  });

  const { id } = data;
  const favour = await Favour.findById(id);
  if (!favour) {
    throw new ApiError(400, "Favour not found.");
  }
  res.json(favour);
});

/* ========== UPDATE REQUEST ========== */

/* Update Favour By Reward */

handler.put(authMiddleware, async (req, res) => {
  const data = await updateFavourRewardsValidation.validate(
    {
      ...req.query,
      ...req.body,
    },
    { abortEarly: false }
  );

  const { id, rewards } = data;

  const favour = await Favour.findById(id);
  if (!favour) {
    throw new ApiError(400, "Favour not found");
  }

  const isCreator = req.userId === favour.creator._id;
  if (!isCreator) {
    throw new ApiError(400, "You are not the creator");
  }

  favour.set({
    rewards,
  });

  const updateFavour = await favour.save();
  res.json(updateFavour);
});

/* ========== DELETE REQUEST ========== */

handler.post(authMiddleware, async (req, res) => {
  const data = await deleteFavourValidation.validate({
    ...req.query,
    ...req.body,
  });

  const { id } = data;
  const favour = await Favour.findById(id);

  if (!favour) {
    throw new ApiError(400, "Favour not found");
  }

  if (!(id === favour.creator._id)) {
    throw new ApiError(400, "You must be the creator to delete");
  }

  favour.remove();
  favour.save();
  res.json("POOF!! I just gobbled you :)");
});

export default handler;
