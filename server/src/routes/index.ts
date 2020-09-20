import express from "express";
import profileRouter from "./profile";
import requestRouter from "./request";
const apiRouter = express.Router();

// Assign routes to main API router
apiRouter.use("/profile", profileRouter);

// Router for Requests (api/router/...)
apiRouter.use("/request", requestRouter);

export default apiRouter;
