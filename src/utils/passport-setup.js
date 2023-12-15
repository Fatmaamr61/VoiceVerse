import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oidc";
import dotenv from "dotenv";
dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_Id,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3006/oauth2/redirect/google",
      scope: ["profile"],
    },
    (request, accessToken, refreshToken, profile, cb) => {
      console.log(profile);
      //return cb(null, profile);
    }
  )
);

export default passport;
