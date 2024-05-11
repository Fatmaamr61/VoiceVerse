import { Schema, Types, model } from "mongoose";

const favoriteSchema = new Schema({
  user: {
    type: Types.ObjectId,
    ref: "user",
  },
  videos: [{ id: { type: Types.ObjectId, ref: "video" } }],
});

export const Favorites = model("favorite", favoriteSchema);
