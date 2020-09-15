import express from "express";
const authRouter = express.Router();

authRouter.get("/login", async (req, res) => {
  res.json("logged in!");
});

authRouter.post("/register", async (req, res) => {
  res.json("register whoop!");
});

export default authRouter;
