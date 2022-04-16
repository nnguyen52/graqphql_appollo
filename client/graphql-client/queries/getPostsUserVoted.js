import { gql } from '@apollo/client';
import { Fragment_networkResponse } from '../fragments/networkResponse';
import { Fragment_postInfo } from '../fragments/postInfo';
import { Fragment_pageInfo } from '../fragments/pageInfo';
export const Query_getPostsUserVoted = gql`
  ${Fragment_networkResponse}
  ${Fragment_postInfo}
  ${Fragment_pageInfo}

  query getPostsUserVoted($userId: String, $type: String, $cursor: String, $limit: Int) {
    getPostsUserVoted(userId: $userId, type: $type, cursor: $cursor, limit: $limit) {
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
