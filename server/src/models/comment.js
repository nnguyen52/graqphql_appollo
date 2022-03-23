import mongoose from 'mongoose';
const commentSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
    //tag is the user who commented the original comment (the author of original comment)
    // tag will be a User object
    tag: { type: mongoose.Types.ObjectId, ref: 'User' },
    // reply is id of the comment that this comment is commenting to
    // eg:
    // comment: how much for iphone 13? (id:1)
    // -------------> iphone13 cost 2000$ (this comment have reply as 1, reference to comment id=1)
    reply: { type: mongoose.Types.ObjectId, ref: 'Comment' },
    //user as commentor
    user: { type: mongoose.Types.ObjectId, ref: 'User' },
    postId: { type: mongoose.Types.ObjectId, ref: 'Post' },
    // from postSchema.user
    postUserId: { type: mongoose.Types.ObjectId, ref: 'User' },
    points: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);
const Comment = mongoose.model('Comment', commentSchema);
export default Comment;
