import { gql } from '@apollo/client';
import { Fragment_commentThreelevels } from '../fragments/comment3level';
import { Fragment_networkResponse } from '../fragments/networkResponse';
export const Mutation_voteComment = gql`
  ${Fragment_networkResponse}
  ${Fragment_commentThreelevels}
  mutation voteComment($postId: String, $commentId: String, $voteValue: Int) {
    voteComment(postId: $postId, commentId: $commentId, voteValue: $voteValue) {
      network {
        ...network
      }
      data {
        ...commentThreelevels
      }
    }
  }
`;
