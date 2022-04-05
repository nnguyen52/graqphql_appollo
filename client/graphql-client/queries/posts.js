import { gql } from '@apollo/client';
import { Fragment_commentThreelevels } from '../fragments/comment3level';
import { Fragment_networkResponse } from '../fragments/networkResponse';
import { Fragment_postInfo } from '../fragments/postInfo';

export const Query_getPosts = gql`
  ${Fragment_postInfo}
  ${Fragment_networkResponse}
  ${Fragment_commentThreelevels}
  query getPosts($cursor: String, $limit: Int) {
    getPosts(cursor: $cursor, limit: $limit) {
      network {
        ...network
      }
      data {
        posts {
          ...post
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  }
`;
