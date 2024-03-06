import { Router } from "express";
import { isAuthenticated } from "../../middlewares/Authentication.middleware.js";
import { isValid } from "../../middlewares/validation.middleware.js";
import {
  addFavorite,
  addVideo,
  getFavorites,
  getVideo,
} from "./video.controller.js";
import {
  addToFavSchema,
  addVideoSchema,
  getVideoSchema,
} from "./video.validation.js";
const router = Router();

// add video
router.post("/new", isAuthenticated, isValid(addVideoSchema), addVideo);

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
router.delete("/favorites/delete");

export default router;
