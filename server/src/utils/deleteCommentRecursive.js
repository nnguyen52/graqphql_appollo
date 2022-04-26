import Comment from '../models/comment';
import Post from '../models/post';
import VoteComment from '../models/voteComment';

export const deleteCommenReplyBase = async (_id, postId) => {
  let rootCommentId = null;
  let trackCommentToDelete = null;
  let commentsToDelete = [];
  const commentToDelete = await Comment.findOne({ _id, postId }).populate('reply');
  commentsToDelete.push(commentToDelete._id.toString());
  trackCommentToDelete = commentToDelete;
  rootCommentId = commentToDelete._id;
  const allComments = await Comment.find().populate('reply');
  for (let i = 0; i < allComments.length; i++) {
    if (
      !allComments[i].reply &&
      allComments[i]._id.toString() == rootCommentId.toString() &&
      allComments[i].postId.toString() == postId.toString()
    ) {
      trackCommentToDelete = allComments[i];
      commentsToDelete.push(allComments[i]._id.toString());
    }
    if (
      allComments[i].reply &&
      (allComments[i].reply._id.toString() == trackCommentToDelete._id.toString() ||
        allComments[i].reply._id.toString() == rootCommentId.toString()) &&
      allComments[i].postId.toString() == postId.toString()
    ) {
      commentsToDelete.push(allComments[i]._id.toString());
      trackCommentToDelete = allComments[i];
    }
  }
  const post = await Post.findOne({ _id: postId });
  const newCommentsToDelete = [...new Set(commentsToDelete)];

  const newComments = post.comments.filter(
    (each) => !newCommentsToDelete.includes(each.toString())
  );

  // delete votes from this comments' replies
  // delete comment
  for (const each of newCommentsToDelete) {
    const repliesForThisComment = await VoteComment.find({ commentId: each });
    for (const eachRep of repliesForThisComment)
      await VoteComment.findOneAndDelete({ _id: eachRep });
    await Comment.findOneAndDelete({ _id: each });
  }
  // delete votes this comment has
  const votes = await VoteComment.find({ commentId: rootCommentId });
  for (const each of votes) {
    await VoteComment.findOneAndDelete({ _id: each });
  }

  // update post with new comments
  await Post.findOneAndUpdate({ _id: postId }, { comments: newComments });
  return true;
};
