import mongoose from 'mongoose';
const voteSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Types.ObjectId, ref: 'User' },
    postId: { type: mongoose.Types.ObjectId, ref: 'Post' },
    value: { type: Number }, //only 1 or -1
  },
  { timestamps: true }
);
const Vote = mongoose.model('Vote', voteSchema);
export default Vote;
