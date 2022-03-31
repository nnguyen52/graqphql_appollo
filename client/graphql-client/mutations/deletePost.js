import { gql } from '@apollo/client';
import { Fragment_networkResponse } from '../fragments/networkResponse';

export const Mutation_deletePost = gql`
  ${Fragment_networkResponse}
  mutation deletePost($id: String) {
    deletePost(id: $id) {
      network {
        ...network
      }
    }
  }
`;
