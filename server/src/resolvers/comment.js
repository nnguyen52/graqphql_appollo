import { checkAuth } from "../customMiddleware/checkAuth";
import Post from "../models/Post";
import Comment from "../models/comment";
import User from "../models/user";
export default {
  Comment: {
    user: async (parent) => {
      // console.log('user: ' , JSON.stringify(parent, null, 2));
      return await User.findById(parent.user);
    },
    tag : async (parent ) => {
      return await User.findById(parent.tag);
    }, 
    reply : async (parent) => {
    return await Comment.findById(parent.reply); 
    }
  },
  Query: {
    getComments: async () => {
      try {
        const comments = await Comment.find().populate('reply');; 
        console.log(JSON.stringify(comments , null , 2) );
        return {
          network : {
            code: 200,
            success: true, 
          }, 
          data : comments
        }
      } catch (e) {
        return {
          network: {
            code: 500,
            success: false,
            message: `Internal server error: ${e.message}`,
          },
        };

      }
    }
   }
   , 
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

    updateComment : async (parent , {commentId, content , user } , {req}) => {
      try {
        // const isAllowed = await checkAuth(req);
        // if (!isAllowed) return {
        //     network : {
        //         code: 400,
        //         success: false,
        //         message:  "Action denied. Please login"
        //     } ,data : null
        // }
        const response  = await Comment.findOneAndUpdate(
          { _id: commentId, user },
          { content }, 
          {new : true}
        );
        if (!response) return {
          network : {
            code:400 , 
            success: false, 
            message : `Action denied.` , 
            errors: [{field : 'comment' , message : 'You dont have this permission.'}]
          }
        }
        return {
          network : {
            code :200 , 
            success: true,
            message : "Comment updated!" , 
            errors: null 
          },
          data : response
        } 
      } catch (e) {
        return {
          network: {
            code : 500 ,
            success : false, 
            message : `Internal server error: ${e.message}`
          }
        }}
    }, 
    
    deleteComment: async (parent , {commentId, user} , {req }) => {
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
        const comment = await Comment.findOneAndDelete({_id : commentId , user }).populate('reply'); 
        if (!comment) return {
          network : {
            code:400 , 
            success: false, 
            message : `Action denied.` , 
            errors: [{field : 'comment' , message : 'You dont have this permission.'}]
          }
        } 
         
        const response = await Post.findOneAndUpdate(
          { _id: comment.postId },
          {
            $pull: { comments: commentId },
          }
        ); 
        if (!response) return {
          network : {
            code:400 , 
            success: false, 
            message : `Action denied.` , 
            errors: [{field : 'comment' , message : 'You dont have this permission.'}]
          }
        } 
        console.log('comment out' , JSON.stringify(comment , null , 2 ))
        // then delete all comments that have reply of this comment
        await deleteCommenReplyBase(comment._id , comment.postId);
        return {
          network : {
            code:200, 
            success:true, 
            message: "Comment deleted!"
          }, 
          data : null 
        }
      } catch (e) {
        return {
          network :{
            code: 500 , 
            success: false , 
            message: `Internal server error: ${e.message}`
          }
        }
      }
    }
  },
};
const deleteCommenReplyBase = async (_id , postId ) => {
  const allComments = await Comment.find().populate('reply');
  await Post.findOneAndUpdate({ _id: postId} , {comments :allComments });
     for (let i = 0 ; i < allComments.length ; i++) {
       if (allComments[i].reply._id == comment.reply._id) {
          await Comment.findOneAndDelete({_id }).populate('reply');
          allComments = await Comment.find().populate('reply');
          return deleteCommenReplyBase(allComments[i].reply._id , postId);
        }
       }
     }
