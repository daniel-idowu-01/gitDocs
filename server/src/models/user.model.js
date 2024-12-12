import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    githubUrl: {
      type: String,
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    roleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role",
    },
    googleId: {
      type: String,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);