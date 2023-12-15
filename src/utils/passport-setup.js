/* import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oidc";
import dotenv from "dotenv";
dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_Id,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "https://voice-verse-rho.vercel.app/oauth2/redirect/google",
      scope: ["profile"],
    },
    (request, accessToken, refreshToken, profile, cb) => {
      console.log("profile iD >>>>  ", profile.id);
      //return cb(null, profile);
    }
  )
); */

import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oidc";
import { User } from "../../db/models/user.model.js";
import { FederatedCredentials } from "../../db/models/federatedCredentials.model.js";
import dotenv from "dotenv";
dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/oauth2/redirect/google",
      scope: ["profile"],
    },
    async (accessToken, refreshToken, profile, cb) => {
      try {
        const federatedCredentials = await FederatedCredentials.findOne({
          provider: "google",
          subject: profile.id,
        });

        if (!federatedCredentials) {
          const newUser = new User({
            name: profile.displayName,
          });

          const savedUser = await newUser.save();

          const newFederatedCredentials = new FederatedCredentials({
            user_id: savedUser._id,
            provider: "google",
            subject: profile.id,
            // Add other fields as needed
          });

          await newFederatedCredentials.save();

          return cb(null, savedUser);
        } else {
          const user = await User.findById(federatedCredentials.user_id);

          if (!user) {
            return cb(null, false);
          }

          return cb(null, user);
        }
      } catch (err) {
        return cb(err);
      }
    }
  )
);

export default passport;
