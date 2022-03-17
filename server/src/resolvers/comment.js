import { checkAuth } from "../customMiddleware/checkAuth";
import Post from "../models/Post";
import Comment from "../models/comment";
import User from "../models/user";
import VoteComment from "../models/voteComment";
export default {
  Comment: {
    user: async (parent) => {
      // console.log('user: ' , JSON.stringify(parent, null, 2));
      return await User.findById(parent.user);
    },
    tag: async (parent) => {
      return await User.findById(parent.tag);
    },
    reply: async (parent) => {
      return await Comment.findById(parent.reply);
    },
  },
  Query: {
    getComments: async () => {
      try {
        const comments = await Comment.find().populate("reply");
        // console.log(JSON.stringify(comments, null, 2));
        return {
          network: {
            code: 200,
            success: true,
          },
          data: comments,
        };
      } catch (e) {
        return {
          network: {
            code: 500,
            success: false,
            message: `Internal server error: ${e.message}`,
          },
        };
      }
    },
  },
  Mutation: {
    testMakeComment: async () => {
      const comment1 = new Comment({
        content: "comment root",
        tag: "622ba6549ab5b03daea70a83",
        user: "622ba6549ab5b03daea70a83",
        postId: "622f74ee2a33d5c46650babf",
        postUserId: "622bb40db7b211376f997eb3",
      });
      const commentReply = new Comment({
        reply: comment1._id,
        content: "comment reply",
        tag: "622ba6549ab5b03daea70a83",
        user: "622bb40db7b211376f997eb3",
        postId: "622f74ee2a33d5c46650babf",
        postUserId: "622bb40db7b211376f997eb3",
      });
      const commentNesetedReply = new Comment({
        reply: commentReply._id,
        content: "comment nested reply",
        tag: "622ba6549ab5b03daea70a83",
        user: "622ba6549ab5b03daea70a83",
        postId: "622f74ee2a33d5c46650babf",
        postUserId: "622bb40db7b211376f997eb3",
      });
      await comment1.save();
      await commentReply.save();
      await commentNesetedReply.save();
      const post = await Post.findById({ _id: "622f74ee2a33d5c46650babf" });
      post.comments = [comment1._id, commentReply._id, commentNesetedReply._id];
      await post.save();
    },
    clearAllComment: async () => {
      await Comment.deleteMany();
    },
    createComment: async (
      root,
      { postId, content, tag, reply, postUserId, user },
      { req }
    ) => {
      try {
        // check auth
        // const isAllowed = await checkAuth(req);
        // if (!isAllowed) return {
        //     network : {
        //         code: 400,
        //         success: false,
        //         message:  "Action denied. Please login"
        //     } ,data : null
        // }
        const post = await Post.findOne({ _id: postId });
        if (!post)
          return {
            network: {
              code: 400,
              success: false,
              message: "Invalid data",
              errors: [
                {
                  field: "comment",
                  message:
                    "Sorry, this post you are commenting is no longer exist.",
                },
              ],
            },
            data: null,
          };
        //   if reply exist => this comment is replyComment
        if (reply) {
          const cm = await Comment.findOne({ _id: reply });
          if (!cm)
            return {
              network: {
                code: 400,
                success: false,
                message: "Invalid data",
                errors: [
                  {
                    field: "comment",
                    message:
                      "Sorry, the comment you are replying to is no longer exist.",
                  },
                ],
              },
              data: null,
            };
        }

        // all good -> craete new comment,
        // add comment to post model

        const newComment = new Comment({
          // user : req.session.userId,
          user,
          postId,
          content,
          tag,
          reply,
          postUserId,
        });
        await Post.findOneAndUpdate(
          { _id: postId },
          {
            $push: { comments: newComment._id },
          },
          { new: true }
        );
        await newComment.save();
        return {
          network: {
            code: 200,
            success: true,
            message: "New comment sent!",
            errors: null,
          },
          data: newComment,
        };
      } catch (e) {
        return {
          network: {
            code: 500,
            success: false,
            message: `Internal server error: ${e.message}`,
          },
        };
      }
    },

    updateComment: async (parent, { commentId, content, user }, { req }) => {
      try {
        // const isAllowed = await checkAuth(req);
        // if (!isAllowed) return {
        //     network : {
        //         code: 400,
        //         success: false,
        //         message:  "Action denied. Please login"
        //     } ,data : null
        // }
        const response = await Comment.findOneAndUpdate(
          { _id: commentId, user },
          { content },
          { new: true }
        );
        if (!response)
          return {
            network: {
              code: 400,
              success: false,
              message: `Action denied.`,
              errors: [
                { field: "comment", message: "You dont have this permission." },
              ],
            },
          };
        return {
          network: {
            code: 200,
            success: true,
            message: "Comment updated!",
            errors: null,
          },
          data: response,
        };
      } catch (e) {
        return {
          network: {
            code: 500,
            success: false,
            message: `Internal server error: ${e.message}`,
          },
        };
      }
    },

    deleteComment: async (parent, { commentId, user }, { req }) => {
      try {
        // const isAllowed = await checkAuth(req);
        // if (!isAllowed) return {
        //     network : {
        //         code: 400,
        //         success: false,
        //         message:  "Action denied. Please login"
        //     } ,data : null
        // }

        // then delete all comments that have reply of this comment
        const comment = await Comment.findOne({ _id: commentId });
        if (!comment) {
          return {
            network: {
              code: 400,
              success: false,
              message: "Invalid data",
              errors: [
                {
                  field: "comment",
                  message: "Sorry, this comment is no longer exist",
                },
              ],
            },
          };
        }
        // check if the comment is from user or stranger
        if (comment.user.toString() != req.session.userId) {
          return {
            network: {
              code: 400,
              success: false,
              message: "Action denied.",
              errors: [
                {
                  field: "comment",
                  message: "You dont have permission to do this.",
                },
              ],
            },
          };
        }
        const res = await deleteCommenReplyBase(comment._id, comment.postId);
        if (res)
          return {
            network: {
              code: 200,
              success: true,
              message: "Comment deleted!",
            },
            data: null,
          };
      } catch (e) {
        return {
          network: {
            code: 500,
            success: false,
            message: `Internal server error: ${e.message}`,
          },
        };
      }
    },
    voteComment: async (parent, { commentId, voteValue }, { req }) => {
      try {
        // const allowed = await checkAuth(req);
        // if (!allowed) {
        //   return {
        //     network: {
        //       code: 400,
        //       success: false,
        //       message: "Voting action failed",
        //       errors: [
        //         { field: "vote", message: "Please login to vote posts!" },
        //       ],
        //     },
        //   };
        // }
        if (voteValue !== 1 && voteValue !== -1)
          return {
            network: {
              code: 400,
              success: false,
              message: "Invalid data",
              errors: [{ field: "comment", message: "Invalid voting value." }],
            },
          };
        // find comment to vote
        let comment = await Comment.findOne({
          _id,
          commentId,
          userId: req.session.userId,
        });
        if (!comment)
          return {
            network: {
              code: 400,
              success: false,
              message: `Invalid data`,
              errors: [
                {
                  field: "comment",
                  message: "Sorry, this comment is no longer exist.",
                },
              ],
            },
          };
        let newVote = null;
        let existingVote = await VoteComment.findOne({
          userId: req.session.userId,
          commentId,
        });
        if (!existingVote) {
          newVote = new VoteComment({
            userId: req.session.userId,
            commentId,
            value: voteValue,
          });
          await newVote.save();
        } else {
          if (existingVote.value === voteValue) {
            return {
              network: {
                code: 400,
                success: false,
                message: "Voting action failed.",
                errors: [
                  {
                    field: "vote",
                    message: `You already ${
                      voteValue == 1 ? "upvoted" : "downvoted"
                    }.`,
                  },
                ],
              },
            };
          }
          await VoteComment.findOneAndUpdate(
            { _id: existingVote._id },
            { ...existingVote, value: voteValue }
          );
        }
        // await Vote.findOneAndUpdate(
        //   { userId: req.session.userId, postId },
        //   { userId: req.session.userId, postId, value: voteValue }
        // )
        comment.points = parseInt(comment.points) + voteValue;
        comment.points == 0
          ? voteValue == 1
            ? (comment.points += 1)
            : (comment.points -= 1)
          : null;
        await comment.save();
        const freshComment = await Comment.findOne({ _id: commentId });
        return {
          network: {
            code: 200,
            success: true,
            message: "Comment updated with new votes!",
          },
          data: freshComment,
        };
      } catch (e) {
        console.log(e);
        return {
          network: {
            code: 500,
            success: false,
            message: `Internal server error: ${e.message}`,
          },
        };
      }
    },
  },
};
const deleteCommenReplyBase = async (_id, postId) => {
  let rootCommentId = null;
  let trackCommentToDelete = null;
  let commentsToDelete = [];
  const commentToDelete = await Comment.findOne({ _id, postId }).populate(
    "reply"
  );
  commentsToDelete.push(commentToDelete._id.toString());
  trackCommentToDelete = commentToDelete;
  rootCommentId = commentToDelete._id;
  const allComments = await Comment.find().populate("reply");
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
      (allComments[i].reply._id.toString() ==
        trackCommentToDelete._id.toString() ||
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
  for (const each of newCommentsToDelete) {
    await Comment.findOneAndDelete({ _id: each });
  }
  await Post.findOneAndUpdate({ _id: postId }, { comments: newComments });
  return true;
};
