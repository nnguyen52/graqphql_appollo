import mongoose from 'mongoose';

export const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    userId: { type: mongoose.Types.ObjectId, ref: 'user' },
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
