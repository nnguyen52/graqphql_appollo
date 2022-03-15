import mongoose from 'mongoose';

export const postSchema = new mongoose.Schema(
  {
    userId: mongoose.Types.ObjectId,
    title: {
      type: String,
    },
    userId: mongoose.Types.ObjectId,
    user: {
      type: mongoose.Types.ObjectId,
      ref: 'user',
    },
    content: {
      type: String,
    },
    points: {
      type: Number,
      default: 0,
    },
    comments: [{ type: mongoose.Types.ObjectId, ref: 'comment' }],
  },
  { timestamps: true }
);
const Post = mongoose.model('Post', postSchema);
export default Post;
