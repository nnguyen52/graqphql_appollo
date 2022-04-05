import { gql } from '@apollo/client';
import { Fragment_commentThreelevels } from '../fragments/comment3level';
import { Fragment_networkResponse } from '../fragments/networkResponse';
import { Fragment_postInfo } from '../fragments/postInfo';
import { Fragment_userInfo } from '../fragments/userInfo';

export const Mutation_SearchPosts = gql`
  ${Fragment_networkResponse}
  ${Fragment_userInfo}
  ${Fragment_commentThreelevels}
  ${Fragment_postInfo}
  mutation searchPosts($cursor: String, $limit: Int, $input: String) {
    searchPosts(cursor: $cursor, limit: $limit, input: $input) {
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
