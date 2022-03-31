import { gql } from '@apollo/client';
import { Fragment_networkResponse } from '../fragments/networkResponse';
import { Fragment_userInfo } from '../fragments/userInfo';

export const Mutation_editMe = gql`
  ${Fragment_userInfo}
  ${Fragment_networkResponse}
  mutation editMe($newUserInfo: newUserInfo) {
    editMe(newUserInfo: $newUserInfo) {
      network {
        ...network
      }
      data {
        ...user
      }
    }
  }
`;
