import mongoose from 'mongoose';
const voteSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Types.ObjectId, ref: 'user' },
    postId: { type: mongoose.Types.ObjectId, ref: 'post' },
    value: { type: Number }, //only 1 or -1
  },
  { timestamps: true }
);
const Vote = mongoose.model('vote', voteSchema);
export default Vote;
