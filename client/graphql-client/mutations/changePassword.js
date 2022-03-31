import { gql } from '@apollo/client';

export const Mutation_changePassword = gql`
  mutation changePassword($token: String, $userId: String, $newPassword: String, $type: String) {
    changePassword(token: $token, userId: $userId, newPassword: $newPassword, type: $type) {
      network {
        code
        success
        message
        errors {
          field
          message
        }
      }
      data {
        id
        userName
        email
        karma
      }
    }
  }
`;
