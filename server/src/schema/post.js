import { gql } from 'apollo-server-express';
export default gql`
  type Post {
    _id: String
    userId: String
    user: User
    title: String
    content: String
    points: Int
    comments: Comment
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
  }
  type Mutation {
    createPost(title: String, content: String): CreatePost
    updatePost(id: ID, title: String, content: String): UpdatePost
    deletePost(id: ID): DeletePost
    vote(postId: String, voteValue: Int): UpdatePost
  }
`;
