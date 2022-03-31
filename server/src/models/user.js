import mongoose from 'mongoose';

export const userSchema = new mongoose.Schema(
  {
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
  },
  { timestamps: true }
);
const User = mongoose.model('User', userSchema);
export default User;
