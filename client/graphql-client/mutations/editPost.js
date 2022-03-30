import { gql } from '@apollo/client';
import { Fragment_commentThreelevels } from '../fragments/comment3level';
export const Mutation_editPost = gql`
  ${Fragment_commentThreelevels}
  mutation updatePost($id: String, $title: String, $content: String) {
    updatePost(id: $id, title: $title, content: $content) {
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
        _id
        userId
        user {
          id
          userName
          email
        }
        title
        content
        points
        comments {
          ...commentThreelevels
        }
      }
    }
  }
`;
