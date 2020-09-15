import express from "express";
import authRouter from "./auth";
const apiRouter = express.Router();

// Assign routes to main API router
apiRouter.use("/auth", authRouter);

export default apiRouter;
