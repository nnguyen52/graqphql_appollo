import { gql } from '@apollo/client';
import { Fragment_networkResponse } from '../fragments/networkResponse';
import { Fragment_pageInfo } from '../fragments/pageInfo';
import { Fragment_postInfo } from '../fragments/postInfo';

export const Query_getSaveposts = gql`
  ${Fragment_networkResponse}
  ${Fragment_postInfo}
  ${Fragment_pageInfo}
  query getSavePosts($cursor: String, $limit: Int) {
    getSavePosts(cursor: $cursor, limit: $limit) {
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
