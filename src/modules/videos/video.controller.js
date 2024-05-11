import { asyncHandler } from "../../utils/asyncHandler.js";
import { Video } from "../../../db/models/videos.model.js";
import { Favorites } from "../../../db/models/favorites.model.js";
import cloudinary from "../../utils/cloud.js";

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

export const uploadVideo = asyncHandler(async (req, res, next) => {
  // get user
  const id = req.user._id;
  const { title, description } = req.body;

  // upload video
  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.file.path,
    {
      resource_type: "video",
      folder: `${process.env.FOLDER_CLOUD_NAME}/videos/${id}`,
    }
  );

  const vid = await Video.create({
    video: { url: secure_url, id: public_id },
    title: title,
    description: description,
    user: id,
  });
  return res.json({
    success: true,
    message: "video uploaded successfully..",
    results: vid,
  });
});

export const getVideo = asyncHandler(async (req, res, next) => {
  const { url } = req.body;

  // check vid existance
  const vid = await Video.find({ url }).populate(
    "user",
    "userName profileImage"
  );
  if (vid.length < 1)
    return next(new Error("video not found!", { cause: 404 }));

  return res.json({ success: true, results: vid });
});

export const getAllVideos = asyncHandler(async (req, res, next) => {
  const videos = await Video.find().populate("user", "userName profileImage");
  if (!videos) return next(new Error("no video found!", { cause: 404 }));

  return res.json({ success: true, results: videos });
});

export const addFavorite = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  console.log(id);
  // check if video exist
  const video = await Video.findById(id);
  if (!video) return next(new Error("video not found!", { cause: 404 }));
  console.log("vidd: ", video);

  // check if video already exist in user's favorites
  const addedVid = await Favorites.findOne({
    user: req.user._id,
    "videos.id": id,
  });
  console.log("iddd", addedVid);
  if (addedVid) return next(new Error("already added to favorites"));

  // add to fav
  const fav = await Favorites.findOneAndUpdate(
    { user: req.user._id },
    { $push: { videos: { id: id } } },
    { new: true }
  ).populate({
    path: "videos",
    populate: {
      path: "id",
      model: "video",
    },
  });

  return res.json({
    success: true,
    message: "added to favorites",
    results: fav,
  });
});

export const getFavorites = asyncHandler(async (req, res, next) => {
  const user = req.user._id;

  const favorites = await Favorites.findOne({ user }).populate({
    path: "videos",
    populate: {
      path: "id",
      model: "video",
    },
  });
  if (favorites.videos.length < 1)
    return res.json({ message: "empty list, add your favorite videos :)" });

  return res.json({ success: true, results: favorites });
});

export const removeFromFavorite = asyncHandler(async (req, res, next) => {
  const userID = req.user._id;
  const { url } = req.body;

  console.log("Received URL:", url);

  // Check authority
  const checkUser = await Favorites.findOne({ user: userID });
  if (!checkUser) {
    console.log("User not authorized");
    return next(new Error("Not authorized user", { cause: 401 }));
  }

  const userFav = await Favorites.findOne({ user: userID });

  // Remove vid url from fav
  const updatedFavorites = userFav.videos.filter((video) => video.url !== url);
  userFav.videos = updatedFavorites;
  await userFav.save();

  console.log("Updated Document:", updatedFavorites);

  return res.json({ success: true, results: updatedFavorites });
});
