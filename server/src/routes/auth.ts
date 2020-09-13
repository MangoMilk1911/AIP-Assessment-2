import express from "express";
const authRouter = express.Router();

authRouter.get("/login", (req, res) => {
  res.json("logged in!");
});

export default authRouter;
