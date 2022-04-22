import { gql } from '@apollo/client';
import { Fragment_networkResponse } from '../fragments/networkResponse';
import { Fragment_postInfo } from '../fragments/postInfo';

export const Mutation_hidePost = gql`
  ${Fragment_networkResponse}
  ${Fragment_postInfo}
  mutation hidePost($id: String) {
    hidePost(id: $id) {
      network {
        ...network
      }
      data {
        ...post
      }
    }
  }
`;
