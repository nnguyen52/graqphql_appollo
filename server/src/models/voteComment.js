import mongoose from 'mongoose';

export const voteCommentSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Types.ObjectId, ref: 'User' },
    commentId: { type: mongoose.Types.ObjectId, ref: 'Comment' },
    value: {
      type: Number,
    },
  },
  { timestamps: true }
);
const vote = mongoose.model('VoteComment', voteCommentSchema);
export default vote;
