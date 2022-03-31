import { gql } from '@apollo/client';
import { Fragment_commentThreelevels } from '../fragments/comment3level';
export const Mutation_createPost = gql`
  ${Fragment_commentThreelevels}
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
          karma
        }
        comments {
          ...commentThreelevels
        }
        title
        content
        points
      }
    }
  }
`;
