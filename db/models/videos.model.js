import { Schema, model, Types } from "mongoose";

const videoSchema = new Schema(
  {
    title: String,
    video: {
      url: {
        type: String,
      },
      id: {
        type: String,
      },
    },
    description: String,
    user: { type: Types.ObjectId, ref: "user" },
  },
  { timestamps: true }
);

export const Video = model("video", videoSchema);
