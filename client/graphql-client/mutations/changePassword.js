import { gql } from '@apollo/client';
import { Fragment_networkResponse } from '../fragments/networkResponse';
import { Fragment_userInfo } from '../fragments/userInfo';

export const Mutation_changePassword = gql`
  ${Fragment_networkResponse}
  ${Fragment_userInfo}
  mutation changePassword($token: String, $userId: String, $newPassword: String, $type: String) {
    changePassword(token: $token, userId: $userId, newPassword: $newPassword, type: $type) {
      network {
        ...network
      }
      data {
        ...user
      }
    }
  }
`;
