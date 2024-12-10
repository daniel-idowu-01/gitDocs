import mongoose from "mongoose";

const generateSchema = new mongoose.Schema(
  {
    count: {
      type: Number,
    },
  },
  { timestamps: true }
);

export default mongoose.model("GenerateRequest", generateSchema);
