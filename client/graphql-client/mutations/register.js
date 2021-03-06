import { gql } from '@apollo/client';
import { Fragment_networkResponse } from '../fragments/networkResponse';
import { Fragment_userInfo } from '../fragments/userInfo';
export const Mutation_register = gql`
  ${Fragment_networkResponse}
  ${Fragment_userInfo}
  mutation register($userName: String!, $email: String!, $password: String!) {
    register(userName: $userName, email: $email, password: $password) {
      data {
        ...user
      }
      network {
        ...network
      }
    }
  }
`;
