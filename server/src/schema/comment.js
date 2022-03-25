import { gql } from "apollo-server-express";
export default gql`
  type Comment {
    _id: String
    user: User
    content: String
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
  type VoteComment {
    _id: String
    userId: String
    commentId: String
    value: Int
  }
  type mutationGetVoteCommentResponse {
    network: MutationResponse
    data: [VoteComment]
  }
  type Query {
    getVoteComment: mutationGetVoteCommentResponse
    getComments: queryCommentResponse
    # if there is _id in reply after nested fetch 3 comments
    # => fetch 1 comment => but in Client, write nested query with fragment 3 level
    getComment(commentId: String): mutationCommentResponse
  }
  type Mutation {
    createComment(
      content: String
      tag: String
      postId: String
      postUserId: String
      # populate reply gives Comment
      reply: String
      userTesting: String
    ): mutationCommentResponse
    updateComment(commentId: String, content: String): mutationCommentResponse
    deleteComment(commentId: String): mutationCommentResponse
    voteComment(commentId: String, voteValue: Int): mutationCommentResponse
    testMakeComment: mutationCommentResponse
    clearAllComment: mutationCommentResponse
  }
`;
