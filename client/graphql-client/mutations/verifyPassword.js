import { gql } from '@apollo/client';

export const Mutation_verifyPassword = gql`
  mutation verifyPassword($password: String, $email: String) {
    verifyPassword(password: $password, email: $email) {
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
