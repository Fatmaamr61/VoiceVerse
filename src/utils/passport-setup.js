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
import { asyncHandler } from "./asyncHandler.js";
dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://voice-verse-rho.vercel.app/oauth2/redirect/google",
      scope: ["profile"],
    },
    async (accessToken, refreshToken, profile, cb) => {
      console.log(profile);
      try {
        const federatedCredentials = await FederatedCredentials.findOne({
          provider: "google",
          subject: profile.id,
        });

        if (federatedCredentials.lenght < 1) {
          const newFederatedUser = await FederatedCredentials.create({
            name: profile.displayName,
            provider: "google",
            subject: profile.id,
          });

          return cb(null, newFederatedUser);
        } else {
         /*  const FederatedUser = await FederatedCredentials.findById(
            federatedCredentials.user_id
          ); */

          /* if (!user) {
            return cb(null, false);
          }
 */       
        return cb(null, "user exist");
        }
      } catch (err) {
        return cb(err);
      }
    }
  )
);

export default passport;
