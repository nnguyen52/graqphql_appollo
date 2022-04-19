import { gql } from '@apollo/client';
import { Fragment_networkResponse } from '../fragments/networkResponse';

export const Mutation_unsavePost = gql`
  ${Fragment_networkResponse}
  mutation unsavePost($id: String) {
    unsavePost(id: $id) {
      network {
        ...network
      }
    }
  }
`;
