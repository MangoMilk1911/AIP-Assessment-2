import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";

import User from "./models/User";

// Setup env variables and server
dotenv.config();
const app = express();

// Establish MongoDB connection
mongoose
  .connect(process.env.MONGODB_URL!, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("\u001b[35m", "Connected to DB!");
  });

// Setup routes
app.get("/", async (req, res) => {
  const user = await User.create({ name: "yeet" });

  res.json(user.name);
});

// Start listening for requests!
const port = process.env.PORT || 4000;
app.listen(port, () =>
  console.log("\x1b[36m", `Server running on port ${port} 🏃‍♂️`)
);
