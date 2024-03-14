import { Router } from "express";
import { isValid } from "../../middlewares/validation.middleware.js";
import {
  activateSchema,
  changePasswordSchema,
  sendForgetCodeSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
  setForgetCodeSchema,
  changeUserNameSchema,
} from "./auth.validation.js";
import {
  activateAccount,
  changePassword,
  deleteAccount,
  editUserName,
  googleSuccess,
  logOut,
  login,
  profile,
  profilePic,
  register,
  resetPassword,
  sendForgetCode,
  setForgetCode,
} from "./auth.controller.js";
import { isAuthenticated } from "../../middlewares/Authentication.middleware.js";
import { fileUpload } from "../../utils/multer.js";
//import passport from "../../utils/passport-setup.js";
const router = Router();

// register
router.post("/register", isValid(registerSchema), register);

// activate account
router.get(
  "/confirmEmail/:activationCode",
  isValid(activateSchema),
  activateAccount
);

// login
router.post("/login", isValid(loginSchema), login);

// user profile
router.get("/profile", isAuthenticated, profile);

/* // google login
router.get("/google", passport.authenticate("google", { scope: ["profile"] }));

// google redirect callback url
router.get("/redirect/google", passport.authenticate("google"), googleSuccess); */

// edit username
router.patch(
  "/username/edit",
  isAuthenticated,
  isValid(changeUserNameSchema),
  editUserName
);

// add profile picture
router.post(
  "/profile/picture",
  isAuthenticated,
  fileUpload.single("image"),
  profilePic
);

// change password
router.patch(
  "/changePassword",
  isValid(changePasswordSchema),
  isAuthenticated,
  changePassword
);

// send forget password code
router.patch("/forgetCode/send", isValid(sendForgetCodeSchema), sendForgetCode);

// set forget code
router.post("/forgetCode/set", isValid(setForgetCodeSchema), setForgetCode);

// reset password
router.patch("/resetPassword", isValid(resetPasswordSchema), resetPassword);

// logOut
router.get("/logout", isAuthenticated, logOut);

// delete account
router.delete("/account/delete", isAuthenticated, deleteAccount);

export default router;
