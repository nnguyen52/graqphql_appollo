import { gql } from '@apollo/client';
import { Fragment_commentThreelevels } from '../fragments/comment3level';
import { Fragment_networkResponse } from '../fragments/networkResponse';

export const Mutation_createComment = gql`
  ${Fragment_networkResponse}
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
        ...network
      }
      data {
        ...commentThreelevels
      }
    }
  }
`;
