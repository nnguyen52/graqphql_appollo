import { gql } from '@apollo/client';
export const Mutation_Login = gql`
  mutation login($userNameOrEmail: String!, $password: String!) {
    login(userNameOrEmail: $userNameOrEmail, password: $password) {
      data {
        id
        userName
        email
        karma
      }
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
