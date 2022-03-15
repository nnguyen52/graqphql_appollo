import { checkAuth } from "../customMiddleware/checkAuth";
import Post from "../models/Post";
import Comment from "../models/comment";
import User from "../models/user";
export default {
  Comment: {
    user: async (parent) => {
      console.log(JSON.stringify(parent, null, 2));
      return await User.findById(parent.user);
    },
  },
  Mutation: {
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
  },
};
