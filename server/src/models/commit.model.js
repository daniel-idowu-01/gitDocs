import mongoose from "mongoose";

const commitSchema = new mongoose.Schema(
  {
    repoUrl: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Commit", commitSchema);
