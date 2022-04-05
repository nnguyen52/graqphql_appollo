import { gql } from '@apollo/client';
import { Fragment_networkResponse } from '../fragments/networkResponse';

export const Query_checkCommentVotedFromUser = gql`
  ${Fragment_networkResponse}
  query checkCommentVotedFromUser($commentId: String) {
    checkCommentVotedFromUser(commentId: $commentId) {
      network {
        ...network
      }
      data {
        value
      }
    }
  }
`;
