import { gql } from '@apollo/client';
import { Fragment_commentThreelevels } from '../fragments/comment3level';
import { Fragment_networkResponse } from '../fragments/networkResponse';
import { Fragment_postInfo } from '../fragments/postInfo';
import { Fragment_userInfo } from '../fragments/userInfo';

export const Query_getPostByID = gql`
  ${Fragment_networkResponse}
  ${Fragment_userInfo}
  ${Fragment_commentThreelevels}
  ${Fragment_postInfo}
  query getPostByID($id: String) {
    getPostByID(id: $id) {
      network {
        ...network
      }
      data {
        ...post
      }
    }
  }
`;
