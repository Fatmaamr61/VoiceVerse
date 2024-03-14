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
          "https://res.cloudinary.com/dc4zgmrmf/image/upload/v1710460050/VoiceVerse%20defaults/user/WhatsApp_Image_2024-03-11_at_19.05.02_iowoqo.jpg",
      },
      id: {
        type: String,
        default: "VoiceVerse%20defaults/user/userDefaultProfile",
      },
    },
    accountStatus: {
      type: String,
      enum: ["Free", "Starter", "Business"],
      default: "Free",
    },
  },
  { timestamps: true }
);

// model
export const User = model("user", userSchema);
