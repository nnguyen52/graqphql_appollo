import mongoose from 'mongoose';
import { userSchema } from '../models/user';
export const postSchema = new mongoose.Schema({
  userId: mongoose.Types.ObjectId,
  title: {
    type: String,
  },
  userId: mongoose.Types.ObjectId,
  user: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
  },
  content: {
    type: String,
  },
});
const Post = mongoose.model('Post', postSchema);
export default Post;
