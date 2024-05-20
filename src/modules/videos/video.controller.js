import { asyncHandler } from "../../utils/asyncHandler.js";
import { Video } from "../../../db/models/videos.model.js";
import { Favorites } from "../../../db/models/favorites.model.js";
import cloudinary from "../../utils/cloud.js";
import axios from "axios";
import { User } from "../../../db/models/user.model.js";
import { Dubbing } from "../../../db/models/dubbing.model.js";
import { Cloning } from "../../../db/models/cloning.model.js";
import FormData from "form-data";
import fs from "fs";

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

export const getUserVideos = asyncHandler(async (req, res, next) => {
  const user = req.user._id;
  console.log(user);
  const userId = user.toString();
  console.log(userId);

  // First, verify that the userId is provided and valid
  if (!userId) {
    return res.status(400).json({ message: "User ID is required" });
  }
  // Check if user exists
  const userExists = await User.findById(userId);
  if (!userExists) {
    return res.status(404).json({ message: "User not found" });
  }

  // Fetch all videos associated with the userId
  const videos = await Video.find({ user: userId });

  // Return the videos to the client
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
  const { id } = req.params;

  // check if video exist
  const video = await Video.findById(id);
  if (!video) return next(new Error("video not found!", { cause: 404 }));
  console.log("vidd: ", video);

  const userFav = await Favorites.findOne({ user: userID });

  console.log("ID to remove:", id);
  console.log(
    "Favorites before removal:",
    userFav.videos.map((video) => video.id.toString())
  );

  // Remove vid url from fav
  const updatedFavorites = userFav.videos.filter(
    (video) => video.id.toString() !== id.toString()
  );
  console.log(
    "Favorites after removal:",
    updatedFavorites.map((video) => video.id.toString())
  );

  userFav.videos = updatedFavorites;
  await userFav.save();

  console.log("Updated Document:", updatedFavorites);

  return res.json({ success: true, results: updatedFavorites });
});

export const videoDubbing = asyncHandler(async (req, res, next) => {
  const { description, title, original_video } = req.body;
  const dubbingBaseUrl = "http://django-app:8000/api/v1/dubbing/video-dubbing/";
  const user = req.user._id;
  const requestData = {
    title,
    description,
    original_video,
  };

  const { data } = await axios.post(dubbingBaseUrl, requestData);
  //console.log("Status Code:", response.status);
  console.log("res: ", data);

  // Accessing the audio URL directly from the response data
  const audioUrl = data.audio;
  console.log("AudioUrl: ", audioUrl);

  // check if there is dubbing db
  const userDub = await Dubbing.findOne({ user });
  if (userDub) {
    const addToDub = await Dubbing.findOneAndUpdate(
      { user },
      {
        $push: {
          dubbedAudio: {
            title,
            description,
            audioUrl,
            originalVideo: original_video,
          },
        },
      },
      { new: true }
    );
    console.log("addToDub: ", addToDub);
    return res.json({
      success: true,
      addToDub,
    });
  }

  const dubbingData = await Dubbing.create({
    user,
    dubbedAudio: {
      title,
      description,
      audioUrl,
      originalVideo: original_video,
    },
  });
  console.log("dubbingData: ", dubbingData);

  // Returning only the audio URL in the response
  return res.json({
    success: true,
    dubbingData,
  });
});

export const soundCLone = asyncHandler(async (req, res, next) => {
  const { title, textToSpeech } = req.body; // Get title and textToSpeech from body
  const audio_file = req.file;
  const user = req.user._id;

  console.log("title: ", title);
  console.log("textToS: ", textToSpeech);
  console.log("audio: ", audio_file);

  const soundClonerBaseUrl =
    "http://django-app:8000/api/v1/dubbing/audio-dubbing/";

  const formData = new FormData();
  formData.append("title", title);
  formData.append("textToSpeech", textToSpeech);
  formData.append("audio_file", fs.createReadStream(audio_file.path));

  const response = await axios.post(soundClonerBaseUrl, formData, {
    headers: formData.getHeaders(), // Axios will correctly set the Content-Type to multipart/form-data with the boundary.
  });

  console.log("Status Code:", response.status);
  console.log("Body:", response.data);

  const userClone = await Cloning.findOne({ user });
  if (userClone) {
    const addToClone = await Cloning.findOneAndUpdate(
      { user },
      {
        $push: {
          clonedAudio: {
            title,
            textToSpeech,
            audioUrl: response.data.dubbed_audio,
          },
        },
      },
      { new: true }
    );
    console.log("addToClone: ", addToClone);
    return res.json({
      success: true,
      addToClone,
    });
  }

  const cloningData = await Cloning.create({
    user: req.user._id,
    clonedAudio: {
      title,
      textToSpeech,
      audioUrl: response.data.dubbed_audio,
    },
  });

  return res.json({ success: true, results: cloningData });
});

export const getDubbingData = asyncHandler(async (req, res, next) => {
  const user = req.user._id;

  // from dub model
  const dubbingList = await Dubbing.findOne({ user });

  return res.json(dubbingList);
});

export const getCLoningData = asyncHandler(async (req, res, next) => {
  const user = req.user._id;

  // from dub model
  const cloningList = await Cloning.findOne({ user });

  return res.json(cloningList);
});
