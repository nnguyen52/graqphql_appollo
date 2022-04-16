import { gql } from '@apollo/client';
import { Fragment_networkResponse } from '../fragments/networkResponse';
import { Fragment_pageInfo } from '../fragments/pageInfo';
import { Fragment_postInfo } from '../fragments/postInfo';

export const Query_getPostsFromUser = gql`
  ${Fragment_networkResponse}
  ${Fragment_postInfo}
  ${Fragment_pageInfo}
  query getPostsFromUser($userId: String, $cursor: String, $limit: Int) {
    getPostsFromUser(userId: $userId, cursor: $cursor, limit: $limit) {
      network {
        ...network
      }
      data {
        posts {
          ...post
        }
        pageInfo {
          ...pageInfo
        }
      }
    }
  }
`;
