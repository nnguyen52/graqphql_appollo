import { gql } from 'apollo-server-express';
export default gql`
  scalar Date

  type Post {
    _id: String
    userId: String
    user: User
    title: String
    content: String
    points: Int
    comments: [Comment]
    createdAt: Date
  }
  type PostInfo {
    hasNextPage: Boolean
    endCursor: String
  }

  type getAllPostsPagination {
    hasNextPage: Boolean
    endCursor: String
  }
  type getAllPostsPaginationResponse {
    posts: [Post]
    pageInfo: getAllPostsPagination
  }

  type getAllPostResponse {
    network: MutationResponse
    data: getAllPostsPaginationResponse
  }

  type GetPostByIDResponse {
    network: MutationResponse
    data: Post
  }
  type voteValue {
    voteValue: Int
  }
  type checkPostVotedFromUserResponse {
    network: MutationResponse
    data: voteValue
  }
  type CreatePost {
    network: MutationResponse
    data: Post
  }
  type UpdatePost {
    network: MutationResponse
    data: Post
  }
  type DeletePost {
    network: MutationResponse
  }
  type Query {
    getPosts(cursor: String, limit: Int): getAllPostResponse
    getPostByID(id: String): GetPostByIDResponse
    getPostsFromUser(cursor: String, limit: Int): getAllPostResponse
    checkPostVotedFromUser(postId: String): checkPostVotedFromUserResponse
  }
  type Mutation {
    createPost(title: String, content: String): CreatePost
    updatePost(id: String, title: String, content: String): UpdatePost
    deletePost(id: String): DeletePost
    vote(postId: String, voteValue: Int): UpdatePost
    searchPosts(cursor: String, limit: Int, input: String): getAllPostResponse
  }
`;
