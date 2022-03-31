import { gql } from '@apollo/client';
import { Fragment_networkResponse } from '../fragments/networkResponse';
import { Fragment_userInfo } from '../fragments/userInfo';

export const Query_me = gql`
  ${Fragment_networkResponse}
  ${Fragment_userInfo}
  query me {
    me {
      network {
        ...network
      }
      data {
        ...user
      }
    }
  }
`;
