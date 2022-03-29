import { gql } from '@apollo/client';
import { Fragment_commentThreelevels } from '../fragments/comment3level';

export const Mutation_createComment = gql`
  ${Fragment_commentThreelevels}
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
        ...commentThreelevels
      }
    }
  }
`;
