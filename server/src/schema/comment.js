import { gql } from "apollo-server-express";
export default gql`
  type Comment {
    _id: String
    user: User
    content: String!
    # tag is the user who commented the original comment
    tag: User
    # if reply field exist, this comment will be a reply to that replyId
    reply: Comment
    points: Int
    postId: String
    postUserId: String
  }
  type queryCommentResponse {
    network: MutationResponse
    data: [Comment]
  }
  type mutationCommentResponse {
    network: MutationResponse
    data: Comment
  }
  type Query {
    getComments: queryCommentResponse
  }
  type Mutation {
    createComment(
      content: String
      # //////
      # MUST DELETE THIS ONE LATER
      user: String
      # //////
      tag: String
      postId: String
      postUserId: String
      # populate reply gives Comment
      reply: String
    ): mutationCommentResponse
    updateComment(
      commentId: String
      content: String
      user: String
    ): mutationCommentResponse
    deleteComment(commentId: String, user: String): mutationCommentResponse
    voteComment(commentId: String, value: Int): mutationCommentResponse
    testMakeComment: mutationCommentResponse
    clearAllComment: mutationCommentResponse
  }
`;
