import { gql } from '@apollo/client';
export const Mutation_SearchUsers = gql`
  mutation searchUsers($cursor: String, $limit: Int, $input: String) {
    searchUsers(cursor: $cursor, limit: $limit, input: $input) {
      network {
        code
        success
        message
        errors {
          field
          message
        }
      }
      data {
        users {
          id
          userName
          email
          karma
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  }
`;
