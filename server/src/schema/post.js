import { gql } from "apollo-server-express";
export default gql`
  scalar Date
  scalar File
  scalar Upload

  type File {
    filename: String!
    mimetype: String!
    encoding: String!
  }
  type Post {
    _id: String
    userId: String
    user: User
    title: String
    content: String
    points: Int
    comments: [Comment]
    images: [String]
    imageCover: String
    createdAt: Date
  }
  type PostInfo {
    hasNextPage: Boolean
    endCursor: String
  }

  type pagination {
    hasNextPage: Boolean
    endCursor: String
  }
  type getPostsPaginationResponse {
    posts: [Post]
    pageInfo: pagination
  }

  type getPostsResponse {
    network: MutationResponse
    data: getPostsPaginationResponse
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
  type SavePost {
    network: MutationResponse
    data: Post
  }
  type HidePost {
    network: MutationResponse
    data: Post
  }
  type UnsavePost {
    network: MutationResponse
  }
  type DeletePost {
    network: MutationResponse
  }
  type Query {
    getPosts(cursor: String, limit: Int): getPostsResponse
    getPostByID(id: String): GetPostByIDResponse
    checkPostVotedFromUser(postId: String): checkPostVotedFromUserResponse
    getSavePosts(cursor: String, limit: Int): getPostsResponse
  }
  type Mutation {
    createPost(
      title: String
      content: String
      publicIDs: [String]
      imgCoverFile: Upload
    ): CreatePost
    updatePost(
      id: String
      title: String
      content: String
      publicIDs: [String]
      imgCoverFile: Upload
    ): UpdatePost
    savePost(id: String): SavePost
    unsavePost(id: String): UnsavePost
    hidePost(id: String): HidePost
    deletePost(id: String): DeletePost
    vote(postId: String, voteValue: Int): UpdatePost
    searchPosts(cursor: String, limit: Int, input: String): getPostsResponse
    deleteImages(publicIDs: [String]): networkResponse
  }
`;
