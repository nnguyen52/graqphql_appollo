import { gql } from '@apollo/client';
import { Fragment_networkResponse } from '../fragments/networkResponse';
export const Mutation_deleteComment = gql`
  ${Fragment_networkResponse}
  mutation deleteComemnt($commentId: String) {
    deleteComment(commentId: $commentId) {
      network {
        ...network
      }
    }
  }
`;
