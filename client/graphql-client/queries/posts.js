import { gql } from '@apollo/client';
import { Fragment_commentThreelevels } from '../fragments/comment3level';
export const Query_getPosts = gql`
  ${Fragment_commentThreelevels}
  query getPosts($cursor: String, $limit: Int) {
    getPosts(cursor: $cursor, limit: $limit) {
      network {
        message
        success
        code
        errors {
          field
          message
        }
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
