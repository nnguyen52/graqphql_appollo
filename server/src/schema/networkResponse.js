import { gql } from 'apollo-server-express';

export default gql`
  type networkResponse {
    network: MutationResponse
  }
`;
