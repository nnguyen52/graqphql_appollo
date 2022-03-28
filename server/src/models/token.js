import mongoose from "mongoose";
export const tokenSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
  // type: what kind of action user is doing (forgot passwprd/change password/ deleting account...)
  type: String,
  token: String,
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 60 * 5, //5 minutes only
  },
});
const Token = mongoose.model("Token", tokenSchema);
export default Token;
