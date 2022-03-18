import { gql } from '@apollo/client';
export const Mutation_createPost = gql`
  mutation createPost($title: String, $content: String) {
    createPost(title: $title, content: $content) {
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
        userId
        _id
        user {
          id
          userName
          email
        }
        title
        content
        points
      }
    }
  }
`;
