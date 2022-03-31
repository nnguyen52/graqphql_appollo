import { gql } from '@apollo/client';
import { Fragment_networkResponse } from '../fragments/networkResponse';
import { Fragment_userInfo } from '../fragments/userInfo';
export const Mutation_Login = gql`
  ${Fragment_networkResponse}
  ${Fragment_userInfo}
  mutation login($userNameOrEmail: String!, $password: String!) {
    login(userNameOrEmail: $userNameOrEmail, password: $password) {
      data {
        ...user
      }
      network {
        ...network
      }
    }
  }
`;
