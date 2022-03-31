import { gql } from '@apollo/client';
import { Fragment_networkResponse } from '../fragments/networkResponse';
export const Mutation_vote = gql`
  ${Fragment_networkResponse}
  mutation vote($postId: String, $voteValue: Int) {
    vote(postId: $postId, voteValue: $voteValue) {
      network {
        ...network
      }
      data {
        _id
        points
        userId
        title
        content
      }
    }
  }
`;
