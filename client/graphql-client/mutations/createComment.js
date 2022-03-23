import { gql } from '@apollo/client';

export const Mutation_createComment = gql`
  mutation createComment(
    $content: String
    $tag: String
    $postId: String
    $postUserId: String
    $reply: String
  ) {
    createComment(
      content: $content
      tag: $tag
      postId: $postId
      postUserId: $postUserId
      reply: $reply
    ) {
      network {
        code
        success
        message
      }
      data {
        userId
        _id
        user {
          id
          userName
          email
        }
        title
        content
        points
        reply {
          userId
          _id
          user {
            id
            userName
            email
          }
          title
          content
          points
        }
      }
    }
  }
`;
