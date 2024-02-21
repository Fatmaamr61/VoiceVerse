import { Schema, Types, model } from "mongoose";

const commentSchema = new Schema(
  {
    user: {
      type: Types.ObjectId,
      ref: "user",
    },
    comment: {
      type: String,
    },
  },
  { timestamps: true }
);

export const Comments = model("comments", commentSchema);
