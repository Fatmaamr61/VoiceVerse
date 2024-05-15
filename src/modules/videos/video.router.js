import { Router } from "express";
import { isAuthenticated } from "../../middlewares/Authentication.middleware.js";
import { isValid } from "../../middlewares/validation.middleware.js";
import {
  addFavorite,
  addVideo,
  getAllVideos,
  getFavorites,
  getUserVideos,
  getVideo,
  removeFromFavorite,
  soundCLone,
  uploadVideo,
} from "./video.controller.js";
import {
  addToFavSchema,
  addVideoSchema,
  getVideoSchema,
  removeFromFavSchema,
} from "./video.validation.js";
import { upload } from "../../utils/multer.js";

const router = Router();

// add video
router.post(
  "/new",
  isAuthenticated,
  upload.single("video"),
  isValid(addVideoSchema),
  uploadVideo
);

// get all videos
router.get("/all", isAuthenticated, getAllVideos);

// get video
router.get("/", isAuthenticated, isValid(getVideoSchema), getVideo);

// get user's videos
router.get("/user/:user", isAuthenticated, getUserVideos);

// add to favorite
router.post(
  "/favorites/add/:id",
  isAuthenticated,
  isValid(addToFavSchema),
  addFavorite
);

// get favorites videos
router.get("/favorites", isAuthenticated, getFavorites);

// remove from favorite
router.delete(
  "/favorites/delete/:id",
  isAuthenticated,
  isValid(removeFromFavSchema),
  removeFromFavorite
);

// soundClone
router.post("/soundClone", soundCLone);

export default router;
