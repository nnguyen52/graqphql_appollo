import { gql } from '@apollo/client';

export const Query_checkPostVotedFromUser = gql`
  query checkPostVotedFromUser($postId: String) {
    checkPostVotedFromUser(postId: $postId) {
      network {
        code
        success
      }
      data {
        voteValue
      }
    }
  }
`;
