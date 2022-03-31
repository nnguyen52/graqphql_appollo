import { gql } from '@apollo/client';
import { Fragment_networkResponse } from '../fragments/networkResponse';
import { Fragment_userInfo } from '../fragments/userInfo';
export const Query_getUserByID = gql`
  ${Fragment_networkResponse}
  ${Fragment_userInfo}
  query getUserByID($id: String) {
    getUserByID(id: $id) {
      network {
        ...network
      }
      data {
        ...user
      }
    }
  }
`;
