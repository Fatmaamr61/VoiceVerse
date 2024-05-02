import { asyncHandler } from "../../utils/asyncHandler.js";
import { User } from "../../../db/models/user.model.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { sendEmail } from "../../utils/sendEmail.js";
import {
  passwordResetTemplate,
  signUpTemp,
  accountActivatedTemplate,
} from "../../utils/htmlEmailTemp.js";
import jwt from "jsonwebtoken";
import { Token } from "../../../db/models/token.model.js";
import randomstring from "randomstring";
import cloudinary from "../../utils/cloud.js";
import { nanoid } from "nanoid";
import { Favorites } from "../../../db/models/favorites.model.js";
import Stripe from "stripe";
import { Video } from "../../../db/models/videos.model.js";

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

  // create user's favorites
  await Favorites.create({ user: user._id });

  // send response
  return res.send(accountActivatedTemplate());
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

export const editUserName = asyncHandler(async (req, res, next) => {
  const id = req.user._id;
  const { userName } = req.body;

  const newName = await User.findByIdAndUpdate(id, { userName: userName });

  return res.json({
    success: true,
    message: "userName updated successfully..",
    results: newName,
  });
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

  /*   console.log(req.file);
  
  const params = {
    Bucket: process.env.BUCKET_NAME,
    Key: id,
    Body: req.file,
    ContentType: req.file.mimetype,
  };
  const command = new PutObjectCommand(params);

  await s3.send(command); */

  return res.json({
    success: true,
    message: "profile picture uploaded successfully",
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
  const { forgetCode } = req.body;
  // check forget code
  let user = await User.findOne({ forgetCode });
  if (!user) return next(new Error("Invalid code!", { cause: 400 }));

  return res
    .status(200)
    .json({ success: true, message: "valid code", results: forgetCode });
});

export const resetPassword = asyncHandler(async (req, res, next) => {
  // check user
  let { forgetCode } = req.body;

  const user = await User.findOneAndUpdate(
    { forgetCode },
    { $unset: { forgetCode: 1 } }
  );
  if (!user) return next(new Error("user not found!!"), { cause: 404 });

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

export const payment = asyncHandler(async (req, res, next) => {
  // stripe payment
  const stripe = new Stripe(process.env.STRIPE_KEY);

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    metadata: { order_id: order._id.toString() },
    success_url: process.env.SUCCESS_URL,
    cancel_url: process.env.CANCEL_URL,
    line_items: order.products.map((product) => {
      return {
        price_data: {
          currency: "EGP",
          product_data: {
            name: product.name,
          },
          unit_amount: product.itemPrice * 100,
        },
        quantity: product.quantity,
      };
    }),
    discounts: existCoupon ? [{ coupon: existCoupon.id }] : [],
  });

  return res.json({
    success: true,
    results: session.url,
  });
});

export const logOut = asyncHandler(async (req, res, next) => {
  const id = req.user._id;
  let { token } = req.headers;

  // invalidate token
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

  // remove videos
  const remVid = await Video.findOneAndDelete({ user: id });
  return res
    .status(202)
    .json({ success: true, message: `user deleted successfully..` });
});

export const subscriptionWebhook = asyncHandler(async (request, response) => {
  // server.js
  //
  // Use this sample code to handle webhook events in your integration.
  //
  // 1) Paste this code into a new file (server.js)
  //
  // 2) Install dependencies
  //   npm install stripe
  //   npm install express
  //
  // 3) Run the server on http://localhost:4242
  //   node server.js

  // The library needs to be configured with your account's secret key.
  // Ensure the key is kept out of any version control system you might be using.
  const stripe = new Stripe(process.env.STRIPE_KEY);
  const sig = request.headers["stripe-signature"];

  // This is your Stripe CLI webhook secret for testing your endpoint locally.
  const endpointSecret =
    "whsec_0f274daf321fb3913df1c878784d36fde72be3840646af3d2b032867df62a05c";

  app.post(
    "/webhook",
    express.raw({ type: "application/json" }),
    (request, response) => {
      const sig = request.headers["stripe-signature"];

      let event;

      try {
        event = stripe.webhooks.constructEvent(
          request.body,
          sig,
          endpointSecret
        );
      } catch (err) {
        response.status(400).send(`Webhook Error: ${err.message}`);
        return;
      }

      // Handle the event
      switch (event.type) {
        case "customer.subscription.created":
          const customerSubscriptionCreated = event.data.object;
          // Then define and call a function to handle the event customer.subscription.created
          break;
        case "customer.subscription.deleted":
          const customerSubscriptionDeleted = event.data.object;
          // Then define and call a function to handle the event customer.subscription.deleted
          break;
        // ... handle other event types
        default:
          console.log(`Unhandled event type ${event.type}`);
      }

      // Return a 200 response to acknowledge receipt of the event
      response.send();
    }
  );

  app.listen(4242, () => console.log("Running on port 4242"));
});
