import { gql } from '@apollo/client';

export const Query_getPosts = gql`
  query getPosts($cursor: String, $limit: Int) {
    getPosts(cursor: $cursor, limit: $limit) {
      network {
        message
        success
        code
        errors {
          field
          message
        }
      }
      data {
        posts {
          userId
          title
          points
          _id
          content
          comments {
            _id
            content
            user {
              userName
            }
            reply {
              _id
              content
              reply {
                tag {
                  userName
                }
                _id
                content
              }
            }
          }
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  }
`;
