import { Schema, model } from "mongoose";

//schema
const userSchema = new Schema(
  {
    userName: String,
    email: {
      type: String,
      unique: true,
      lowercase: true,
    },
    googleId: String,
    password: {
      type: String,
    },
    isConfirmed: {
      type: Boolean,
      default: false,
    },
    forgetCode: String,
    activationCode: String,
    profileImage: {
      url: {
        type: String,
        default:
          "https://res.cloudinary.com/dc4zgmrmf/image/upload/v1697893176/VoiceVerse%20defaults/user/userDefaultProfile.jpg",
      },
      id: {
        type: String,
        default: "VoiceVerse%20defaults/user/userDefaultProfile",
      },
    },
  },
  { timestamps: true }
);

// model
export const User = model("user", userSchema);
