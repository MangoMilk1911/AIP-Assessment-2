import express from "express";
import authRouter from "./auth";
import favourRouter from "./favour";
const apiRouter = express.Router();

// Assign routes to main API router
apiRouter.use("/auth", authRouter);
apiRouter.use("/favour", favourRouter);

export default apiRouter;
