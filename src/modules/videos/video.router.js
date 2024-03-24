import { Router } from "express";
import { isAuthenticated } from "../../middlewares/Authentication.middleware.js";
import { isValid } from "../../middlewares/validation.middleware.js";
import {
  addFavorite,
  addVideo,
  getAllVideos,
  getFavorites,
  getVideo,
  removeFromFavorite,
} from "./video.controller.js";
import {
  addToFavSchema,
  addVideoSchema,
  getVideoSchema,
  removeFromFavSchema,
} from "./video.validation.js";
const router = Router();

// add video
router.post("/new", isAuthenticated, isValid(addVideoSchema), addVideo);

// get all videos
router.get("/all", isAuthenticated, getAllVideos);

// get video
router.get("/", isAuthenticated, isValid(getVideoSchema), getVideo);

// add to favorite
router.post(
  "/favorites/add",
  isAuthenticated,
  isValid(addToFavSchema),
  addFavorite
);

// get favorites videos
router.get("/favorites", isAuthenticated, getFavorites);

// remove from favorite
router.delete(
  "/favorites/delete",
  isAuthenticated,
  isValid(removeFromFavSchema),
  removeFromFavorite
);

export default router;
