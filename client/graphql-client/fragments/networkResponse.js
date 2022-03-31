import { gql } from '@apollo/client';
export const Fragment_networkResponse = gql`
  fragment network on MutationResponse {
    code
    success
    message
    errors {
      field
      message
    }
  }
`;
