import { gql } from "apollo-server-express";
export default gql`
  type Comment {
    _id: String
    user: User
    content: String!
    # tag is the user who commented the original comment
    tag: String
    # if reply field exist, this comment will be a reply to that replyId
    reply: String
    points: Int
    postId: String
    postUserId: String
  }
  type createCommentResponse {
    network: MutationResponse
    data: Comment
  }
  type Mutation {
    # postId, content, tag, reply, postUserId
    createComment(
      content: String
      user: String
      #   tag is the user who commented the original comment
      tag: String
      postId: String
      postUserId: String
      reply: String
    ): createCommentResponse
  }
`;
