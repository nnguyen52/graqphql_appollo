import mongoose from "mongoose";
const commentSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
    //tag is the user who commented the original comment
    tag: Object,
    reply: mongoose.Types.ObjectId,
    //user as commentor
    user: { type: mongoose.Types.ObjectId, ref: "user" },
    postId: mongoose.Types.ObjectId,
    // from postSchema.user
    postUserId: mongoose.Types.ObjectId,
    points: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);
const Comment = mongoose.model("comment", commentSchema);
export default Comment;
