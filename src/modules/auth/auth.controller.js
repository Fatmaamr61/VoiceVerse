import { asyncHandler } from "../../utils/asyncHandler.js";
import { User } from "../../../db/models/user.model.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { sendEmail } from "../../utils/sendEmail.js";
import {
  passwordResetTemplate,
  signUpTemp,
} from "../../utils/htmlEmailTemp.js";
import jwt from "jsonwebtoken";
import { Token } from "../../../db/models/token.model.js";
import randomstring from "randomstring";
import cloudinary from "../../utils/cloud.js";
import { nanoid } from "nanoid";
import { error } from "console";

export const register = asyncHandler(async (req, res, next) => {
  // data from request
  const { email, userName, password } = req.body;

  // check user existance
  const isUser = await User.findOne({ email });
  if (isUser)
    return next(new Error("Email already registered", { cause: 409 }));

  // hash password
  const hashPassword = bcrypt.hashSync(password, parseInt(process.env.SALT));

  // generate activation code
  const activationCode = crypto.randomBytes(64).toString("hex");

  // create user
  const user = await User.create({
    email,
    userName,
    password: hashPassword,
    activationCode,
  });

  // create confirmation link
  const link = `https://voice-verse-livid.vercel.app/auth/confirmEmail/${activationCode}`;

  // send email
  const isSent = await sendEmail({
    to: email,
    subject: "activate account",
    html: signUpTemp(link),
  });

  // send response
  return isSent
    ? res.json({ success: true, message: "please check your email" })
    : next(new Error("something went wrong!"));
});

export const activateAccount = asyncHandler(async (req, res, next) => {
  // find user, delete activation code, update isConfirmed
  const user = await User.findOneAndUpdate(
    { activationCode: req.params.activationCode },
    {
      isConfirmed: true,
      $unset: { activationCode: 1 },
    }
  );

  // check if user doesn't exist
  if (!user) return next(new Error("user not found!!", { cause: 404 }));

  // send response
  return res.send(
    "congratulations your account is now activated!, you can login now"
  );
});

export const login = asyncHandler(async (req, res, next) => {
  // data from request
  const { email, password } = req.body;

  // check user
  const user = await User.findOne({ email });
  if (!user) return next(new Error("invalid email!", { cause: 400 }));

  // check is confrirmed
  if (!user.isConfirmed)
    return next(new Error("un activated account!!", { cause: 400 }));

  // check password
  const pass = bcrypt.compareSync(password, user.password);
  if (!pass) return next(new Error("Wrong password", { cause: 400 }));

  // generate token
  const token = jwt.sign(
    { id: user._id, email: user.email },
    process.env.TOKEN_KEY,
    { expiresIn: "2d" }
  );

  // save token in token model
  await Token.create({
    token,
    user: user._id,
    agent: req.headers["user-agent"],
  });

  // send response
  return res.json({ success: true, token: token, results: "home-page" });
});

export const profile = asyncHandler(async (req, res, next) => {
  const id = req.user._id;

  const user = await User.findById(id);

  if (!user) return next(new Error("user not found", { cause: 404 }));

  return res.json({ success: true, result: user });
});

export const googleSuccess = asyncHandler(async (req, res, next) => {
  return res.json({ success: true, result: "home page" });
});

export const profilePic = asyncHandler(async (req, res, next) => {
  // get user
  const id = req.user._id;

  const cloudFolder = nanoid();

  // upload profile image
  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.file.path,
    {
      folder: `${process.env.FOLDER_CLOUD_NAME}/ProfilePics/${id}/${cloudFolder}`,
    }
  );

  // add pp
  const pic = await User.findByIdAndUpdate(id, {
    profileImage: { url: secure_url, id: public_id },
  });

  return res.json({
    success: true,
    message: "profile picture uploaded successfully",
    result: pic,
  });
});

export const changePassword = asyncHandler(async (req, res, next) => {
  // data from request
  let { oldPassword, newPassword } = req.body;
  const id = req.user._id;

  // find user
  const user = await User.findById(id);

  // check old password
  const pass = bcrypt.compareSync(oldPassword, user.password);
  if (!pass)
    return next(new Error("Wrong password, try again", { cause: 400 }));

  // change password
  user.password = bcrypt.hashSync(
    req.body.newPassword,
    parseInt(process.env.SALT)
  );
  await user.save();

  // send response
  return res.json({
    success: true,
    results: "password changed successfully..",
  });
});

export const sendForgetCode = asyncHandler(async (req, res, next) => {
  // check user
  const user = await User.findOne({ email: req.body.email });

  if (!user) return next(new Error("email is not exist!", { cause: 404 }));

  // generate code
  const code = randomstring.generate({
    length: 5,
    charset: "numeric",
  });

  // save code in db
  user.forgetCode = code;
  await user.save();

  // send email
  const emailCode = (await sendEmail({
    to: user.email,
    subject: "Reset Password",
    html: passwordResetTemplate(code),
  }))
    ? res.json({ success: true, results: "check your email!" })
    : next(new Error("something went wrong"));
});

export const setForgetCode = asyncHandler(async (req, res, next) => {
  // check forget code
  let user = await User.findOne({ forgetCode: req.body.forgetCode });
  if (!user) return next(new Error("Invalid code!", { cause: 400 }));

  return res.status(200).json({ success: true, result: "valid code" });
});

export const resetPassword = asyncHandler(async (req, res, next) => {
  // check user
  let user = await User.findOne({ forgetCode: req.body.forgetCode });
  if (!user) return next(new Error("Invalid code!", { cause: 400 }));

  user = await User.findOneAndUpdate(
    { forgetCode: req.body.forgetCode },
    { $unset: { forgetCode: 1 } }
  );

  user.password = bcrypt.hashSync(
    req.body.password,
    parseInt(process.env.SALT)
  );
  await user.save();

  // invalidate tokens
  const tokens = await Token.find({ user: user._id });

  tokens.forEach(async (token) => {
    token.isValid = false;
    await token.save();
  });

  // response
  return res.json({
    success: true,
    message: "password reset successfully, try to login!",
  });
});

export const logOut = asyncHandler(async (req, res, next) => {
  const id = req.user._id;
  let { token } = req.headers;

  token = token.split(process.env.BEARER)[1];
  const removeToken = await Token.findOneAndUpdate(
    { token },
    { isValid: false },
    { new: true }
  );

  return res.status(202).json({ success: true, message: `You are logged Out` });
});

export const deleteAccount = asyncHandler(async (req, res, next) => {
  const id = req.user._id;
  let { token } = req.headers;

  // delete user
  const user = await User.findByIdAndDelete(id);

  // delete token
  token = token.split(process.env.BEARER)[1];
  const removeToken = await Token.findOneAndDelete({ token });

  return res
    .status(202)
    .json({ success: true, message: `user deleted successfully..` });
});
