/* import passport from "passport";
import GoogleStrategy from "passport-google-oauth20";
import { User } from "../../db/models/user.model.js";
import dotenv from "dotenv";
import { asyncHandler } from "./asyncHandler.js";
dotenv.config();

passport.serializeUser((user, done) => {
  console.log("user from seria", user);
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  console.log("user id from des", id);
  const user = await User.findById(id);
  done(null, user);
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3006/auth/redirect/google",
    },
    asyncHandler(async (accessToken, refreshToken, profile, done) => {
      console.log("redirect FIRED!");
      const currentUser = await User.findOne({ googleId: profile.id });
      console.log(profile);
      if (currentUser) {
        console.log("user exist");
        //done(null, currentUser);
      } else {
        console.log("user created");
        const newUser = await User.create({
          firstName: profile.name.givenName,
          lastName: profile.name.familyName,
          userName: profile.displayName,
          googleId: profile.id,
          isConfirmed: true,
        });
        //done(null, newUser);
      }
    })
  )
);

export default passport;
 */