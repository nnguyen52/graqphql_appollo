import { gql } from '@apollo/client';
import { Fragment_networkResponse } from '../fragments/networkResponse';

export const Query_checkPostVotedFromUser = gql`
  ${Fragment_networkResponse}
  query checkPostVotedFromUser($postId: String) {
    checkPostVotedFromUser(postId: $postId) {
      network {
        ...network
      }
      data {
        voteValue
      }
    }
  }
`;
