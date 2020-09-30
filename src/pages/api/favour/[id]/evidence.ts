import { ApiError } from "lib/errorHandler";
import { authMiddleware } from "lib/middleware";
import createHandler from "lib/routeHandler";
import { Favour } from "models";
import { updateFavourEvidenceValidation } from "models/Favour";

const handler = createHandler();

/* Update Favour By Evidence */

handler.put(authMiddleware, async (req, res) => {
  const data = await updateFavourEvidenceValidation.validate(
    {
      ...req.query,
      ...req.body,
    },
    { abortEarly: false }
  );

  const { id, evidence } = data;

  const favour = await Favour.findById(id);
  if (!favour) {
    throw new ApiError(400, "You are not the creator");
  }

  favour.set({
    evidence,
  });

  const updateFavour = await favour.save();
  res.json(updateFavour);
});

export default handler;
