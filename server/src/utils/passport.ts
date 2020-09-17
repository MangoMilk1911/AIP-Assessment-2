import passport from "passport";
import {
  Strategy as JWTStrategy,
  ExtractJwt,
  VerifyCallback,
} from "passport-jwt";
import { User } from "../models";

// ==================== JWT ====================

/**
 * This function is called whenever the jwt authenticate
 * middleware is used to fetch the user details from the db
 *
 * @param payload JWT Payload containing user id
 * @param done passport callback function
 */
const JWTVerify: VerifyCallback = async (payload, done) => {
  const foundUser = await User.findById(payload._id);
  return done(null, foundUser || false);
};

// Assign the JWT Strategy
passport.use(
  new JWTStrategy(
    {
      secretOrKey: process.env.JWT_SECRET!,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    },
    JWTVerify
  )
);

export default passport;
