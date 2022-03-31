import { gql } from '@apollo/client';
import { Fragment_networkResponse } from '../fragments/networkResponse';

export const Mutation_verifyPassword = gql`
  ${Fragment_networkResponse}
  mutation verifyPassword($password: String, $email: String) {
    verifyPassword(password: $password, email: $email) {
      network {
        ...network
      }
    }
  }
`;
