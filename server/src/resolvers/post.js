import { checkAuth } from '../customMiddleware/checkAuth';
import Post from '../models/Post';
import User from '../models/user';
export default {
  Post: {
    user: async (parent) => {
      return await User.findById(parent.userId);
    },
  },
  Query: {
    getPosts: async () => {
      try {
        const posts = await Post.find();
        return {
          network: {
            code: 200,
            success: true,
          },
          data: posts,
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
    getPostByID: async (parent, { id }) => {
      try {
        const post = await Post.findOne({ _id: id });
        if (!post)
          return {
            network: {
              code: 400,
              success: false,
              message: 'Post Not Found',
            },
          };
        return {
          network: {
            code: 200,
            success: true,
          },
          data: post,
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
  Mutation: {
    createPost: async (parent, { title, content }, { req }) => {
      try {
        const allowed = await checkAuth(req);
        if (!allowed) {
          return {
            network: {
              code: 400,
              success: false,
              message: 'Access Denied',
            },
          };
        }
        const user = await User.findById(req.session.userId);
        const newPost = new Post({
          userId: req.session.userId,
          user,
          title,
          content,
        });
        await newPost.save();
        return {
          network: {
            code: 200,
            success: true,
            message: 'Post created!',
          },
          data: newPost,
        };
      } catch (e) {
        console.log(e);
        return {
          network: {
            code: 500,
            success: false,
            message: `Internal error: ${e.message}`,
          },
        };
      }
    },
    updatePost: async (parent, { id, title, content }, { req }) => {
      try {
        const allowed = await checkAuth(req);
        if (!allowed) {
          return {
            network: {
              code: 400,
              success: false,
              message: 'Access Denied',
            },
          };
        }
        const post = await Post.findByIdAndUpdate({ _id: id }, { title, content }, { new: true });
        return {
          network: {
            code: 200,
            success: true,
            message: 'Post updated',
          },
          data: post,
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
    deletePost: async (parent, { id }, { req }) => {
      try {
        const allowed = await checkAuth(req);
        if (!allowed) {
          return {
            network: {
              code: 400,
              success: false,
              message: 'Access Denied',
            },
          };
        }
        await Post.findByIdAndDelete({ _id: id, userId: req.session.userId });
        return {
          network: {
            code: 200,
            success: true,
            message: 'Post deleted!',
          },
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
