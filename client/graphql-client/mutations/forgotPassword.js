import { gql } from '@apollo/client';
import { Fragment_networkResponse } from '../fragments/networkResponse';
export const Mutation_forgotPassword = gql`
  ${Fragment_networkResponse}
  mutation forgotPassword($email: String) {
    forgotPassword(email: $email) {
      network {
        ...network
      }
    }
  }
`;
