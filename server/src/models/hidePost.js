import mongoose from "mongoose";

export const hidepostSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Types.ObjectId, ref: "User" },
    postId: { type: mongoose.Types.ObjectId, ref: "Post" },
  },
  { timestamps: true }
);
const Hidepost = mongoose.model("Hidepost", hidepostSchema);
export default Hidepost;
