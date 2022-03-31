import { gql } from '@apollo/client';
import { Fragment_commentThreelevels } from '../fragments/comment3level';
import { Fragment_networkResponse } from '../fragments/networkResponse';

export const Mutation_editComment = gql`
  ${Fragment_networkResponse}
  ${Fragment_commentThreelevels}
  mutation updateComment($commentId: String, $content: String) {
    updateComment(commentId: $commentId, content: $content) {
      network {
        ...network
      }
      data {
        ...commentThreelevels
      }
    }
  }
`;
