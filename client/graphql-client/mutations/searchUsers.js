import { gql } from '@apollo/client';
import { Fragment_networkResponse } from '../fragments/networkResponse';
import { Fragment_userInfo } from '../fragments/userInfo';

export const Mutation_SearchUsers = gql`
  ${Fragment_networkResponse}
  ${Fragment_userInfo}
  mutation searchUsers($cursor: String, $limit: Int, $input: String) {
    searchUsers(cursor: $cursor, limit: $limit, input: $input) {
      network {
        ...network
      }
      data {
        users {
          ...user
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  }
`;
