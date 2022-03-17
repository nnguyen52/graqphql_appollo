import mongoose from "mongoose";

export const voteCommentSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Types.ObjectId, ref: "user" },
    commentId: { type: mongoose.Types.ObjectId, ref: "comment" },
    value: {
      type: Number,
    },
  },
  { timestamps: true }
);
const vote = mongoose.model("voteComment", voteCommentSchema);
export default vote;
