import { Schema, Types, model } from "mongoose";

const castSchema = new Schema(
  {
    actorName: String,
    movies: [
      {
        type: Types.ObjectId,
        ref: "movie",
      },
    ],
  },
  { timestamps: true }
);

export const Cast = model("cast", castSchema);
