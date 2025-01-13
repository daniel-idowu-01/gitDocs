import mongoose from "mongoose";

const countcommitSchema = new mongoose.Schema(
  {
    count: {
      type: Number,
    },
  },
  { timestamps: true }
);

export default mongoose.model("CountCommit", countcommitSchema);
