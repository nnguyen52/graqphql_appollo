import { gql } from '@apollo/client';
export const Mutation_vote = gql`
  mutation vote($postId: String, $voteValue: Int) {
    vote(postId: $postId, voteValue: $voteValue) {
      network {
        success
        message
        code
        errors {
          field
          message
        }
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
