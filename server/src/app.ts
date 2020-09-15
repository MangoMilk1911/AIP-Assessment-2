import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import routes from "./routes";

// Setup env variables and server
dotenv.config();
const app = express();
app.use(express.json());

// Establish MongoDB connection
mongoose
  .connect(process.env.MONGODB_URL!, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("\u001b[35m" + "Connected to DB! 😊");
  });

// register routes
app.use("/api", routes);

// Start listening for requests!
const port = process.env.PORT || 4000;
app.listen(port, () =>
  console.log("\x1b[36m" + `Server running on http://localhost:${port} 🏃‍♂️`)
);
