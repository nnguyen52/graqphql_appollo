import Comment from '../models/comment';
import Vote from '../models/votes';
import VoteComment from '../models/voteComment';
import Post from '../models/Post';
export const deletePost = async (postToDelete, userId) => {
  try {
    // delete all votes that have this postId
    const votes = await Vote.find({ postId: postToDelete._id.toString() });
    if (votes.length > 0)
      for (const each of votes) {
        await Vote.findOneAndDelete({ _id: each._id.toString() });
      }
    // delete all comments that have this postId
    // and delete all vote comments this post have
    const comments = await Comment.find({
      postId: postToDelete._id.toString(),
    });
    if (comments.length > 0) {
      for (const eachCmt of comments)
        await Comment.findOneAndDelete({ _id: eachCmt._id.toString() });
    }
    const voteComments = await VoteComment.find({
      postId: postToDelete._id.toString(),
    });
    if (voteComments.length > 0) {
      for (const eachVoteCmt of voteComments)
        await VoteComment.findOneAndDelete({
          _id: eachVoteCmt._id.toString(),
        });
    }

    await Post.findByIdAndDelete({
      _id: postToDelete._id.toString(),
      userId,
    });
  } catch (e) {
    console.log(e);
  }
};
