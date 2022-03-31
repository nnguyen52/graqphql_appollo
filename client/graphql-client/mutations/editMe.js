import { gql } from '@apollo/client';

export const Mutation_editMe = gql`
  mutation editMe($newUserInfo: newUserInfo) {
    editMe(newUserInfo: $newUserInfo) {
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
