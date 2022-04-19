import { gql } from '@apollo/client';
import { Fragment_networkResponse } from '../fragments/networkResponse';
import { Fragment_postInfo } from '../fragments/postInfo';

export const Mutation_savePost = gql`
  ${Fragment_networkResponse}
  ${Fragment_postInfo}
  mutation savePost($id: String) {
    savePost(id: $id) {
      network {
        ...network
      }
      data {
        ...post
      }
    }
  }
`;
