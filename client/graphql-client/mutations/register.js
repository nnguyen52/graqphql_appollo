import { gql } from '@apollo/client';
export const Mutation_register = gql`
  mutation register($userName: String!, $email: String!, $password: String!) {
    register(userName: $userName, email: $email, password: $password) {
      data {
        id
        userName
        email
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
