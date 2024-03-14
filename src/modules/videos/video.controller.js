import { asyncHandler } from "../../utils/asyncHandler.js";
import { Video } from "../../../db/models/videos.model.js";
import { Favorites } from "../../../db/models/favorites.model.js";

export const addVideo = asyncHandler(async (req, res, next) => {
  const id = req.user._id;
  const { url, title, description } = req.body;

  // check if vid already existed
  const checkVid = await Video.findOne({ url });
  if (checkVid) return next(new Error("video already exists"));

  const vid = await Video.create({ url, title, description, user: id });

  return res.json({
    success: true,
    message: "video uploaded successfully",
    results: vid,
  });
});

export const getVideo = asyncHandler(async (req, res, next) => {
  const { url } = req.body;

  // check vid existance
  const vid = await Video.find({ url });
  if (vid.length < 1)
    return next(new Error("video not found!", { cause: 404 }));

  return res.json({ success: true, results: vid });
});

export const addFavorite = asyncHandler(async (req, res, next) => {
  const { url } = req.body;

  // check if video exist
  const video = await Video.findOne({ url });
  if (!video) return next(new Error("video not found!", { cause: 404 }));
  console.log("vidd: ", video._id.toString());

  // check if video already exist in user's favorites
  const addedVid = await Favorites.findOne({
    user: req.user._id,
    "videos.url": url,
  });
  console.log("iddd", addedVid);
  if (addedVid) return next(new Error("already added to favorites"));

  // add to fav
  const fav = await Favorites.findOneAndUpdate(
    { user: req.user._id },
    { $push: { videos: video._id } },
    { new: true }
  ).populate("videos");

  return res.json({
    success: true,
    message: "added to favorites",
    results: fav,
  });
});

export const getFavorites = asyncHandler(async (req, res, next) => {
  const user = req.user._id;

  const favorites = await Favorites.findOne({ user }).populate("videos");
  if (favorites.videos.length < 1)
    return res.json({ message: "empty list add you favorite videos :)" });

  return res.json({ success: true, results: favorites });
});

export const removeFromFavorite = asyncHandler(async (req, res, next) => {
  const user = req.user._id;
  const { url } = req.body;

  // check authority
  const checkUser = await Favorites.findOne({ user });
  if (!user) return next(new Error("not authorized user", { cause: 401 }));

  // remove vid url from fav
  const removeFav = await Favorites.findOneAndDelete({ "videos.url": url });

  return res.json({ success: true, results: removeFav });
});
