import mongoose from 'mongoose';

export const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    userId: { type: mongoose.Types.ObjectId, ref: 'User' },
    user: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
    },
    content: {
      type: String,
    },
    points: {
      type: Number,
      default: 0,
    },
    comments: [{ type: mongoose.Types.ObjectId, ref: 'Comment' }],
    images: [{ type: String }],
    imageCover: { type: String },
  },
  { timestamps: true }
);
const Post = mongoose.model('Post', postSchema);
export default Post;
