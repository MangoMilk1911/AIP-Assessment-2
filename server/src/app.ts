import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { body, validationResult } from "express-validator";
import routes from "./routes";
import logger from "./utils/logger";
import errorHandler from "./utils/errorHandler";
import { User } from "./models";

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

// prettier-ignore
const testValidation = [
  body("id")
    .isMongoId().withMessage("Invalid User ID.").bail()
    .custom((val) => User.exists(val)),
  body("name")
    .exists({ checkFalsy: true }).withMessage("No name provided.").bail()
    .isEmail().withMessage("Invalid eMail address.")
];

app.post("/test", ...testValidation, (req, res) => {
  validationResult(req).throw(); // Validation errors handled externally

  res.json("hi");
});

app.use(errorHandler);

// Start listening for requests!
const port = process.env.PORT || 4000;
app.listen(port, () =>
  logger.info(`Server running on http://localhost:${port} 🏃‍♂️`)
);
