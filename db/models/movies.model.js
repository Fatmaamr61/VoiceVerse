import { Schema, Types, model } from "mongoose";

const movieSchema = new Schema(
  {
    imageAssets: {
      url: {
        type: String,
        default:
          "https://res.cloudinary.com/dc4zgmrmf/image/upload/v1708533851/VoiceVerse%20defaults/movies/default_image_x2dg5y.png",
      },
    },
    cover: {
      url: {
        type: String,
        default:
          "https://res.cloudinary.com/dc4zgmrmf/image/upload/v1708533851/VoiceVerse%20defaults/movies/default_image_x2dg5y.png",
      },
    },
    movieName: {
      type: String,
      required: true,
    },
    movieRating: {
      type: Number,
      required: true,
    },
    year: {
      type: Date,
      required: true,
    },
    cast: [
      {
        type: Types.ObjectId,
        ref: "cast",
        required: true,
      },
    ],
    comments: [
      {
        type: Types.ObjectId,
        ref: "comments",
      },
    ],
    trailer: {
      url: {
        type: String,
        required: true,
      },
    },
    tags: [{ type: String, required: true }],
  },
  { timestamp: true }
);

export const Movies = model("movies", movieSchema);
