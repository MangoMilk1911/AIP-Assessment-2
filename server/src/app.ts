require("dotenv").config();
import express from "express";
import mongoose from "mongoose";
import routes from "./routes";
import { errorHandler, logger } from "./utils";

export const __prod__ = process.env.NODE_ENV === "production";

// Create server
const app = express();

// Apply middleware
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

// Apply error handling middleware last
app.use(errorHandler);

// Start listening for requests!
const port = process.env.PORT || 4000;
app.listen(port, () =>
  logger.info(`Server running on http://localhost:${port} 🏃‍♂️`)
);
