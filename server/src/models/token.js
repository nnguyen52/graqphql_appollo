import mongoose from 'mongoose';
export const tokenSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    ref: 'user',
  },
  token: String,
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 60 * 5, //5 minutes only
  },
});
const Token = mongoose.model('token', tokenSchema);
export default Token;
