import mongoose, { Schema, model, Types } from "mongoose";

const genresSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      url: "https://res.cloudinary.com/dc4zgmrmf/image/upload/v1708533851/VoiceVerse%20defaults/movies/default_image_x2dg5y.png",
    },
    movies: [
      {
        type: Types.ObjectId,
        ref: "movies",
      },
    ],
  },
  { timestamps: true }
);

export const Genres = model("genres", genresSchema);
