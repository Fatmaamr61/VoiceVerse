import joi from "joi";

// add video
export const addVideoSchema = joi.object({
  title: joi.string().min(2).max(50).required(),
  description: joi.string(),
});

// get video
export const getVideoSchema = joi.object({
  url: joi.string().required(),
});

// add to favorites
export const addToFavSchema = joi.object({
  id: joi.string(),
});

// remove from favorite
export const removeFromFavSchema = joi.object({
  id: joi.string().required(),
});
