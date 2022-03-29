import mongoose from "mongoose";

const communitySchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    NSFW: {
      type: boolean,
    },
    description: {
      type: String,
    },
    admin: { type: mongoose.Types.ObjectId, ref: "User" },
    posts: [{ type: mongoose.Types.ObjectId, ref: "Post" }],
    members: [{ type: mongoose.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);
const Community = mongoose.model("Community", communitySchema);
export default Community;
