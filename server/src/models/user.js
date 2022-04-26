import mongoose from 'mongoose';
import { randomEmote } from '../utils/randomEmote';
export const userSchema = new mongoose.Schema(
  {
    // _id: {
    //   type: String,
    // },
    userName: {
      type: String,
      unique: true,
      required: true,
      minlength: 1,
      maxlength: 100,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 100,
    },
    karma: {
      type: Number,
      default: 0,
    },
    avatar: {
      type: String,
      default:
        'https://res.cloudinary.com/cloudinarystore/image/upload/v1649302927/Reddis/w1nalwdha9cv8jlj6yjg.jpg',
    },
    about: {
      type: String,
      default: `a fellow Reddisor ${randomEmote()}`,
    },
  },
  { timestamps: true }
);
const User = mongoose.model('User', userSchema);
export default User;
