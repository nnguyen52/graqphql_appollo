import { gql } from '@apollo/client';
import { Fragment_networkResponse } from '../fragments/networkResponse';

export const Mutation_deleteImages = gql`
  ${Fragment_networkResponse}
  mutation deleteImages($publicIDs: [String]) {
    deleteImages(publicIDs: $publicIDs) {
      network {
        ...network
      }
    }
  }
`;
