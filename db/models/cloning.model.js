import { Schema, Types, model } from "mongoose";

const cloningmodelSchema = new Schema(
  {
    user: {
      type: Types.ObjectId,
      ref: "user",
    },
    title: String,
    textTospeech: String,
    clonedAudio: String,
  },
  { timestamps: true }
);

export const Cloning = model("cloning", cloningmodelSchema);
