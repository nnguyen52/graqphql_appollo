import { gql } from '@apollo/client';

export const Mutation_deletePost = gql`
  mutation deletePost($id: String) {
    deletePost(id: $id) {
      network {
        message
        success
        code
        errors {
          field
          message
        }
      }
    }
  }
`;
