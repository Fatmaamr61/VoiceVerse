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
} from "./auth.validation.js";
import {
  activateAccount,
  changePassword,
  deleteAccount,
  googlescucess,
  logOut,
  login,
  register,
  resetPassword,
  sendForgetCode,
} from "./auth.controller.js";
import { isAuthenticated } from "../../middlewares/Authentication.middleware.js";
const router = Router();
import passport from "../../utils/passport-setup.js";

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

// login with google
router.get("/login/google", passport.authenticate("google"));

/* router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/failed" }),
  googlescucess
); */

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
router.patch("/forgetCode/set", isValid(setForgetCodeSchema));

// reset password
router.patch("/resetPassword", isValid(resetPasswordSchema), resetPassword);

// logOut
router.get("/logout", isAuthenticated, logOut);

// delete account
router.delete("/account/delete", isAuthenticated, deleteAccount);

export default router;
