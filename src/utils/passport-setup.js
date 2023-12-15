import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oidc";
import dotenv from "dotenv";
dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_Id,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      //callbackURL: "https://voice-verse-rho.vercel.app/oauth2/redirect/google",
      scope: ["profile"],
    },
    (request, accessToken, refreshToken, profile, cb) => {
      console.log("profile iD >>>>  ", profile.id);
      //return cb(null, profile);
    }
  )
);

export default passport;
