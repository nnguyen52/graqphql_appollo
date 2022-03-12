import { gql } from '@apollo/client';

export const Query_getPosts = gql`
  query getPosts {
    getPosts {
      network {
        code
      }
      data {
        content
        title
        user {
          userName
        }
      }
    }
  }
`;
