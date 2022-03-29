import { checkAuth } from '../customMiddleware/checkAuth';
import Post from '../models/Post';
import Comment from '../models/comment';
import User from '../models/user';
import VoteComment from '../models/voteComment';
import { deleteCommenReplyBase } from '../utils/deleteCommentRecursive';
export default {
  Comment: {
    user: async (parent) => {
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
    getComment: async (parent, { commentId }, { req }) => {
      try {
        // const isAllowed = await checkAuth(req);
        // if (!isAllowed)
        //   return {
        //     network: {
        //       code: 400,
        //       success: false,
        //       message: "Action denied",
        //       errors: [
        //         { field: "comment", message: "Please login see more contents!" },
        //       ],
        //     },
        //   };
        const comment = await Comment.findOne({
          _id: commentId.toString(),
        }).populate('reply');
        if (!comment)
          return {
            network: {
              code: 400,
              success: false,
              message: 'Invalid data',
              errors: [
                {
                  field: 'comment',
                  message: 'Sorry, this comment no longer exist.',
                },
              ],
            },
          };
        return {
          network: {
            code: 200,
            success: true,
          },
          data: comment,
        };
      } catch (e) {
        console.log(e);
        return {
          network: {
            code: 500,
            success: false,
            message: `Internal server error ${e}`,
          },
        };
      }
    },

    getComments: async () => {
      try {
        const comments = await Comment.find().populate('reply').sort({ createdAt: 1 });
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
    getVoteComment: async (parent, {}, {}) => {
      const votesComment = await VoteComment.find();
      return {
        network: {
          code: 200,
          success: true,
        },
        data: votesComment,
      };
    },
  },
  Mutation: {
    testMakeComment: async () => {},
    clearAllComment: async () => {},
    createComment: async (root, { postId, content, tag, reply, postUserId }, { req }) => {
      try {
        const isAllowed = await checkAuth(req);
        if (!isAllowed)
          return {
            network: {
              code: 400,
              success: false,
              message: 'Action denied',
              errors: [{ field: 'comment', message: 'Please login to comment.' }],
            },
          };
        const post = await Post.findOne({ _id: postId, userId: postUserId });
        if (!post)
          return {
            network: {
              code: 400,
              success: false,
              message: 'Invalid data',
              errors: [
                {
                  field: 'comment',
                  message: 'Sorry, this post you are commenting is no longer exist.',
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
                message: 'Invalid data',
                errors: [
                  {
                    field: 'comment',
                    message: 'Sorry, the comment you are replying to is no longer exist.',
                  },
                ],
              },
              data: null,
            };
        }

        // all good -> craete new comment,
        // add comment to post model
        const newComment = new Comment({
          user: req.session.userId,
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
            message: 'New comment sent!',
            errors: null,
          },
          data: newComment,
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

    updateComment: async (parent, { commentId, content }, { req }) => {
      try {
        const isAllowed = await checkAuth(req);
        if (!isAllowed)
          return {
            network: {
              code: 400,
              success: false,
              message: 'Action denied',
              errors: [{ field: 'comment', message: 'Please login to edit comment.' }],
            },
            data: null,
          };
        const response = await Comment.findOneAndUpdate(
          { _id: commentId, user: req.session.userId },
          { content },
          { new: true }
        );
        if (!response)
          return {
            network: {
              code: 400,
              success: false,
              message: `Action denied.`,
              errors: [{ field: 'comment', message: 'You dont have this permission.' }],
            },
          };
        return {
          network: {
            code: 200,
            success: true,
            message: 'Comment updated!',
            errors: null,
          },
          data: response,
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
    deleteComment: async (parent, { commentId }, { req }) => {
      try {
        const isAllowed = await checkAuth(req);
        if (!isAllowed)
          return {
            network: {
              code: 400,
              success: false,
              message: 'Action denied.',
              errors: [
                {
                  field: 'comment',
                  message: 'Please login to delete comment.',
                },
              ],
            },
          };
        // then delete all comments that have reply of this comment
        const comment = await Comment.findOne({ _id: commentId });
        if (!comment) {
          return {
            network: {
              code: 400,
              success: false,
              message: 'Invalid data',
              errors: [
                {
                  field: 'comment',
                  message: 'Sorry, this comment is no longer exist',
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
              message: 'Comment deleted!',
            },
            data: null,
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
    voteComment: async (parent, { postId, commentId, voteValue }, { req }) => {
      try {
        const allowed = await checkAuth(req);
        if (!allowed) {
          return {
            network: {
              code: 400,
              success: false,
              message: 'Access denied.',
              errors: [{ field: 'comment', message: 'Please login to vote comments!' }],
            },
          };
        }
        const existingPost = await Post.findOne({ _id: postId.toString() });
        if (!existingPost) {
          return {
            network: {
              code: 400,
              success: false,
              message: 'Invalid data.',
              errors: [
                {
                  field: 'comment',
                  message: 'Sorry, this post is no longer exist.',
                },
              ],
            },
          };
        }
        if (voteValue !== 1 && voteValue !== -1)
          return {
            network: {
              code: 400,
              success: false,
              message: 'Invalid data',
              errors: [{ field: 'comment', message: 'Invalid voting value.' }],
            },
          };
        // find comment to vote
        let comment = await Comment.findOne({
          _id: commentId,
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
                  field: 'comment',
                  message: 'Sorry, this comment is no longer exist.',
                },
              ],
            },
          };
        let newVote = null;
        // find existing vote
        let existingVote = await VoteComment.findOne({
          userId: req.session.userId,
          commentId,
        });
        if (!existingVote) {
          newVote = new VoteComment({
            userId: req.session.userId,
            commentId,
            postId,
            value: voteValue,
          });
          await newVote.save();
        } else {
          if (existingVote.value === voteValue) {
            return {
              network: {
                code: 400,
                success: false,
                message: 'Voting action failed.',
                errors: [
                  {
                    field: 'vote',
                    message: `You already ${voteValue == 1 ? 'upvoted' : 'downvoted'}.`,
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
        await VoteComment.findOneAndUpdate(
          {
            userId: req.session.userId,
            commentId,
          },
          {
            userId: req.session.userId,
            commentId,
            postId,
            value: voteValue,
          }
        );
        comment.points = parseFloat(comment.points) + parseFloat(voteValue);
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
            message: 'Comment updated with new votes!',
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
