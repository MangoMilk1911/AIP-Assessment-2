import mongoose from "mongoose";

/**
 * Util function for connecting to MongoDB.
 *
 * Should be run anytime access to the database is needed!
 *
 * Will establish a connection the first time and then
 * Mongoose will reuse the same connection.
 */
export default async () => {
  // Return if DB Connection already established
  if (mongoose.connection.readyState) {
    return;
  }

  console.log("Connecting to MongoDB 😊");
  await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: true,
  });
};
