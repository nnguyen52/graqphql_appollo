import { checkAuth } from '../customMiddleware/checkAuth';
import Comment from '../models/comment';
import Post from '../models/Post';
import User from '../models/user';
import Vote from '../models/votes';
import VoteComment from '../models/voteComment';

//src: https://github.com/the-road-to-graphql/fullstack-apollo-express-mongodb-boilerplate/blob/master/src/resolvers/message.js#L6
const toCursorHash = (string) => Buffer.from(string).toString('base64');
const fromCursorHash = (string) => Buffer.from(string, 'base64').toString('ascii');

export default {
  Post: {
    user: async (parent) => {
      return await User.findById(parent.userId);
    },
  },
  Query: {
    // cursor is objectId of last posts[]
    getPosts: async (parent, { cursor, limit = 100 }) => {
      try {
        let realLimit = limit > 100 ? 100 : limit;
        const cursorOptions = cursor
          ? {
              createdAt: {
                $lt: fromCursorHash(cursor),
              },
            }
          : {};
        const posts = await Post.find(cursorOptions, null, {
          sort: { createdAt: -1 },
          limit: realLimit + 1,
        });
        if (posts.length == 0) {
          return {
            network: {
              code: 200,
              success: true,
            },
            data: {
              posts: [],
              pageInfo: {
                hasNextPage: false,
              },
            },
          };
        }
        const hasNextPage = posts.length > realLimit;
        const edges = hasNextPage ? posts.slice(0, -1) : posts;

        // console.log(JSON.stringify(edges, null, 2));
        return {
          network: {
            code: 200,
            success: true,
          },
          data: {
            posts: edges,
            pageInfo: {
              hasNextPage,
              endCursor: hasNextPage
                ? toCursorHash(edges[edges.length - 1].createdAt.toString())
                : null,
            },
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
              errors: [{ field: 'post', message: 'Please login to create post.' }],
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
              errors: [{ field: 'post', message: 'Please login to update post.' }],
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
              errors: [{ field: 'post', message: 'Please login to delete post.' }],
            },
          };
        }
        let tempPostId = null;
        const postToDelete = await Post.findOne({
          _id: id,
          userId: req.session.userId,
        });
        if (!postToDelete) {
          return {
            network: {
              code: 400,
              success: false,
              message: 'Invalid data',
              errors: [
                {
                  field: 'post',
                  message: 'Sorry, this post is no longer exist.',
                },
              ],
            },
          };
        }
        tempPostId = postToDelete._id.toString();
        await Post.findByIdAndDelete({ _id: id, userId: req.session.userId });

        // delete all votes that have this postId
        const votes = await Vote.find({ postId: tempPostId });
        for (const each of votes) {
          await Vote.findOneAndDelete({ _id: each._id.toString() });
        }

        // delete all comments that have this postId
        // and delete all vote comments this post have
        const comments = await Comment.find({ postId: tempPostId });
        const commentsId = comments.map((each) => each._id.toString());
        for (const each of commentsId) {
          await VoteComment.findOneAndDelete({ commentsId: each });
        }
        for (const each of comments) {
          await Comment.findOneAndDelete({ _id: each._id.toString() });
        }

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
    vote: async (parent, { postId, voteValue }, { req }) => {
      try {
        const allowed = await checkAuth(req);
        if (!allowed) {
          return {
            network: {
              code: 400,
              success: false,
              message: 'Access denied.',
              errors: [{ field: 'post', message: 'Please login to vote posts!' }],
            },
          };
        }

        let post = await Post.findOne({ _id: postId });
        if (!post)
          return {
            network: {
              code: 400,
              success: false,
              message: 'Voting action failed.',
              errors: [{ field: 'vote', message: 'Sorry, post no longer exist.' }],
            },
          };
        if (voteValue !== 1 && voteValue !== -1) {
          return {
            network: {
              code: 400,
              success: false,
              message: 'Voting action failed.',
              errors: [{ field: 'vote', message: 'Invalid vote.' }],
            },
          };
        }
        let newVote = null;
        let existingVote = await Vote.findOne({
          userId: req.session.userId,
          postId,
        });
        if (!existingVote) {
          newVote = new Vote({
            userId: req.session.userId,
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
                errors: [{ field: 'vote', message: 'You already voted.' }],
              },
            };
          }
          await Vote.findOneAndUpdate(
            { _id: existingVote._id },
            { ...existingVote, value: voteValue }
          );
        }
        await Vote.findOneAndUpdate(
          { userId: req.session.userId, postId },
          { userId: req.session.userId, postId, value: voteValue }
        );
        post.points = parseFloat(post.points) + parseFloat(voteValue);
        post.points == 0 ? (voteValue == 1 ? (post.points += 1) : (post.points -= 1)) : null;
        await post.save();
        const freshPost = await Post.findOne({ _id: postId });
        return {
          network: {
            code: 200,
            success: true,
            message: 'Post updated with new votes!',
          },
          data: freshPost,
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
