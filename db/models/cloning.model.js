import { Schema, Types, model } from "mongoose";

const cloningmodelSchema = new Schema(
  {
    user: {
      type: Types.ObjectId,
      ref: "user",
    },
    clonedAudio: [{ title: String, textToSpeech: String, audioUrl: String }],
  },
  { timestamps: true }
);

export const Cloning = model("cloning", cloningmodelSchema);
