import express from "express";
import profileRouter from "./profile";
const apiRouter = express.Router();

// Assign routes to main API router
apiRouter.use("/profile", profileRouter);

export default apiRouter;
