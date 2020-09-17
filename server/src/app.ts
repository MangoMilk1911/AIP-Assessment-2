require("dotenv").config();
import express from "express";
import mongoose from "mongoose";
import routes from "./routes";
import passport from "./utils/passport";

export const __prod__ = process.env.NODE_ENV === "production";

// Create server
const app = express();

// Apply middleware
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use(express.json());
app.use(passport.initialize());

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
