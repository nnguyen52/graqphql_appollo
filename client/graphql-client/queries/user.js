import { gql } from '@apollo/client';

export const Query_me = gql`
  query me {
    me {
      network {
        code
        success
        message
      }
      data {
        userName
        email
      }
    }
  }
`;
