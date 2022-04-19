import mongoose from 'mongoose';

export const savepostSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Types.ObjectId, ref: 'User' },
    postId: { type: mongoose.Types.ObjectId, ref: 'Post' },
  },
  { timestamps: true }
);
const Savepost = mongoose.model('Savepost', savepostSchema);
export default Savepost;
