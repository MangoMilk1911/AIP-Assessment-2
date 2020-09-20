import express from "express";
import profileRouter from "./profile";
import favourRouter from "./favour";
const apiRouter = express.Router();

// Assign routes to main API router
apiRouter.use("/profile", profileRouter);
apiRouter.use("/favour", favourRouter);

export default apiRouter;
