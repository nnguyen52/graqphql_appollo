import { gql } from '@apollo/client';
export const Mutation_deleteComment = gql`
  mutation deleteComemnt($commentId: String) {
    deleteComment(commentId: $commentId) {
      network {
        code
        success
        message
        errors {
          field
          message
        }
      }
    }
  }
`;
