import { gql } from '@apollo/client';
import { Fragment_networkResponse } from '../fragments/networkResponse';

export const Mutation_unhidePost = gql`
  ${Fragment_networkResponse}
  mutation unhidePost($id: String) {
    unhidePost(id: $id) {
      network {
        ...network
      }
    }
  }
`;
