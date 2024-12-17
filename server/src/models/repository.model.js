import mongoose from "mongoose";

const repositorySchema = new mongoose.Schema(
  {
    // userId: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "User",
    //   required: true,
    // },
    repoName: {
      type: String,
      required: true,
    },
    repoUrl: {
      type: String,
      required: true,
    },
    license: {
      type: String,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Repository", repositorySchema);