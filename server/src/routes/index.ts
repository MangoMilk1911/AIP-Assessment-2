import express from "express";
const apiRouter = express.Router();

// Assign routes to main API router
apiRouter.use("/auth", async () => await import("./auth"));

export default apiRouter;
