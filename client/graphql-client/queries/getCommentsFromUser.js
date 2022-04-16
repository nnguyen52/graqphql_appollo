import { gql } from '@apollo/client';
import { Fragment_commentThreelevels } from '../fragments/comment3level';
import { Fragment_networkResponse } from '../fragments/networkResponse';
import { Fragment_pageInfo } from '../fragments/pageInfo';
export const Query_getCommentsFromUser = gql`
  ${Fragment_networkResponse}
  ${Fragment_commentThreelevels}
  ${Fragment_pageInfo}

  query getCommentsFromUser($userId: String, $cursor: String, $limit: Int) {
    getCommentsFromUser(userId: $userId, cursor: $cursor, limit: $limit) {
      network {
        ...network
      }
      data {
        comments {
          ...commentThreelevels
        }
        pageInfo {
          ...pageInfo
        }
      }
    }
  }
`;
