import { gql } from '@apollo/client';
import { Fragment_commentThreelevels } from '../fragments/comment3level';
export const Mutation_SearchPosts = gql`
  ${Fragment_commentThreelevels}
  mutation searchPosts($cursor: String, $limit: Int, $input: String) {
    searchPosts(cursor: $cursor, limit: $limit, input: $input) {
      network {
        code
        success
        message
        errors {
          field
          message
        }
      }
      data {
        posts {
          _id
          userId
          user {
            id
            userName
            email
            karma
          }
          title
          content
          points
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
