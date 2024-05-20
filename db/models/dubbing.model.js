import { Schema, Types, model } from "mongoose";

const dubbingSchema = new Schema(
  {
    user: {
      type: Types.ObjectId,
      ref: "user",
    },
    dubbedAudio: [
      {
        title: String,
        description: String,
        audioUrl: String,
        originalVideo: String,
      },
    ],
  },
  { timestamps: true }
);

export const Dubbing = model("dubbing", dubbingSchema);
