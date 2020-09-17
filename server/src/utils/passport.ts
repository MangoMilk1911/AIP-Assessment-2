import argon2 from "argon2";
import passport from "passport";
import { Strategy as LocalStrategy, VerifyFunction } from "passport-local";
import { User } from "../models";
import { UserClass } from "../models/User";

const verify: VerifyFunction = async (username, password, done) => {
  // Check is user exists
  const foundUser = await User.findOne({ username }).select("+password");
  if (!foundUser) {
    return done(null, false);
  }

  // Check if correct password
  const isCorrectPassword = await argon2.verify(foundUser.password!, password);
  if (!isCorrectPassword) {
    return done(null, false);
  }

  // Send user data without password
  return done(null, foundUser.withoutPassword());
};

passport.use(new LocalStrategy(verify));

passport.serializeUser((user: UserClass, done) => {
  console.log("ser");

  done(null, user._id);
});

passport.deserializeUser(async (id: string, done) => {
  console.log("deser");

  const foundUser = await User.findById(id);
  done(null, foundUser);
});

export default passport;
