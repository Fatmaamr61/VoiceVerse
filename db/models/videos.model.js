import { Schema, model, Types } from "mongoose";

const videoSchema = new Schema(
  {
    title: String,
    url: String,
    user: {
      type: Types.ObjectId,
      ref: "user",
    },
    description: String,
  },
  { timestamps: true }
);

export const Video = model("video", videoSchema);
