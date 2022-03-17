import { checkAuth } from '../customMiddleware/checkAuth';
import Post from '../models/Post';
import Comment from '../models/comment';
import User from '../models/user';
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
        const comments = await Comment.find().populate('reply');
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
    createComment: async (root, { postId, content, tag, reply, postUserId, user }, { req }) => {
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
            message: 'New comment sent!',
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
        // const comment = await Comment.findOneAndDelete({
        //   _id: commentId,
        //    $or: [{ user }],
        //   // $or: [{ user }, { postUserId: user }],
        // });
        // delete current comment
        // const comment = await Comment.findOneAndDelete({ _id: commentId, user }).populate('reply');
        // if (!comment)
        //   return {
        //     network: {
        //       code: 400,
        //       success: false,
        //       message: `Action denied.`,
        //       errors: [{ field: 'comment', message: 'You dont have this permission.' }],
        //     },
        //   };

        // const response = await Post.findOneAndUpdate(
        //   { _id: comment.postId },
        //   {
        //     $pull: { comments: commentId },
        //   }
        // );
        // if (!response)
        //   return {
        //     network: {
        //       code: 400,
        //       success: false,
        //       message: `Action denied.`,
        //       errors: [{ field: 'comment', message: 'You dont have this permission.' }],
        //     },
        //   };
        // then delete all comments that have reply of this comment
        const comment = await Comment.findOne({ _id: commentId });
        await deleteCommenReplyBase(comment._id, comment.postId);
        // return {
        //   network: {
        //     code: 200,
        //     success: true,
        //     message: 'Comment deleted!',
        //   },
        //   data: null,
        // };
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
};
const deleteCommenReplyBase = async (_id, postId) => {
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
  // console.log('after:', commentsToDelete);
  const post = await Post.findOne({ _id: postId });
  const newCommentsToDelete = new Set(commentsToDelete);
  const newComments = post.comments.filter((each) => {
    return !newCommentsToDelete.has(each);
  });
  await Post.findOneAndUpdate({ _id: postId }, { comments: newComments });
};
