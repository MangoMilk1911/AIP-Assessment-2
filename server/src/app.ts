import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import routes from "./routes";
import passport from "./utils/passport";
import session from "express-session";
import cors from "cors";

export const __prod__ = process.env.NODE_ENV === "production";

// Setup env variables and server
dotenv.config();
const app = express();

// Apply middleware
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: __prod__, httpOnly: true },
    // store: // TODO: Add persistent store (https://stackoverflow.com/questions/33897276/what-is-the-difference-between-a-session-store-and-database)
    // https://www.npmjs.com/package/connect-mongo
  })
);
app.use(passport.initialize());
app.use(passport.session());

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
