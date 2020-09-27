import { ApiError } from "lib/errorHandler";
import { authMiddleware } from "lib/middleware";
import createHandler from "lib/routeHandler";
import { Request } from "models";
import { checkIdValidation, updateRequestValidation } from "models/Request";

const handler = createHandler();

// ==================== Read a single existing Request ====================

handler.get(authMiddleware);

// ==================== Update Request ====================

handler.put(authMiddleware, async (req, res) => {
  // validates req.body and req.query as one object
  const data = await updateRequestValidation.validate(
    {
      ...req.query,
      ...req.body,
    },
    { abortEarly: false }
  );

  const { id, title, description } = data;

  const request = await Request.findById(id);
  if (!request) {
    throw new ApiError(400, "Request Object not found.");
  }

  const isCreator = req.userId === request.contributions[0].user._id;
  if (!isCreator) {
    throw new ApiError(403, "You are not the Father!");
  }

  request.set({
    title,
    description,
  });
  const updatedRequest = await request.save();
  res.json(updatedRequest);
});

// ==================== Delete Request ====================

handler.delete(authMiddleware, async (req, res) => {
  const { id } = await checkIdValidation.validate(req.query);

  const request = await Request.findById(id);
  if (!request) {
    throw new ApiError(400, "Request Object not found.");
  }

  if (req.userId !== request.contributions[0].user._id) {
    throw new ApiError(403, "You are not the father!");
  }

  request.remove();
  request.save();
  res.json("Request was successfully removed!");
});

export default handler;
