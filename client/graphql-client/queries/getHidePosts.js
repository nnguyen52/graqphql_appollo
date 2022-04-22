import { gql } from '@apollo/client';
import { Fragment_networkResponse } from '../fragments/networkResponse';
import { Fragment_pageInfo } from '../fragments/pageInfo';
import { Fragment_postInfo } from '../fragments/postInfo';

export const Query_getHideposts = gql`
  ${Fragment_networkResponse}
  ${Fragment_postInfo}
  ${Fragment_pageInfo}
  query getHidePosts($cursor: String, $limit: Int) {
    getHidePosts(cursor: $cursor, limit: $limit) {
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
