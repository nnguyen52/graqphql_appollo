import { gql } from 'apollo-server-express';
export default gql`
  type Post {
    userId: String
    user: User
    title: String
    content: String
  }
  type getAllPostResponse {
    network: MutationResponse
    data: [Post]
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
    getPosts: getAllPostResponse
    getPostByID(id: String): GetPostByIDResponse
  }
  type Mutation {
    createPost(title: String!, content: String!): CreatePost
    updatePost(id: ID, title: String, content: String): UpdatePost
    deletePost(id: ID): DeletePost
  }
`;
