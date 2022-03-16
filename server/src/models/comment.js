import mongoose from "mongoose";
const commentSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
    //tag is the user who commented the original comment (the author of original comment)
    // tag will be a User object
    tag: Object,
    // reply is id of the comment that this comment is commenting to
    // eg: 
    // comment: how much for iphone 13? (id:1)
    // -------------> iphone13 cost 2000$ (this comment have reply as 1, reference to comment id=1) 
    reply: {type : mongoose.Types.ObjectId  , ref : 'comment' },
    //user as commentor
    user: { type: mongoose.Types.ObjectId, ref: "user" },
    postId:{ type: mongoose.Types.ObjectId , ref : 'post' },
    // from postSchema.user
    postUserId: { type : mongoose.Types.ObjectId , ref : 'user'},
    points: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);
const Comment = mongoose.model("comment", commentSchema);
export default Comment;
