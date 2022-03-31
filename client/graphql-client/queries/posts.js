import { gql } from '@apollo/client';
import { Fragment_commentThreelevels } from '../fragments/comment3level';
import { Fragment_networkResponse } from '../fragments/networkResponse';
export const Query_getPosts = gql`
  ${Fragment_networkResponse}
  ${Fragment_commentThreelevels}
  query getPosts($cursor: String, $limit: Int) {
    getPosts(cursor: $cursor, limit: $limit) {
      network {
        ...network
      }
      data {
        posts {
          userId
          title
          points
          _id
          content
          comments {
            ...commentThreelevels
          }
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  }
`;
