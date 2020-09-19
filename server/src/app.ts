import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import routes from "./routes";
import logger from "./utils/logger";
import errorHandler from "./utils/errorHandler";

// Setup env variables and server
dotenv.config();
const app = express();

// Setup middleware
app.use(express.json());

// Establish MongoDB connection
mongoose
  .connect(process.env.MONGODB_URL!, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    logger.info("Connected to DB! 😊");
  });

// register routes
app.use("/api", routes);

app.get("/test", (req, res) => {
  throw new Error("bad idk");
});

app.use(errorHandler);

// Start listening for requests!
const port = process.env.PORT || 4000;
app.listen(port, () =>
  logger.info(`Server running on http://localhost:${port} 🏃‍♂️`)
);
