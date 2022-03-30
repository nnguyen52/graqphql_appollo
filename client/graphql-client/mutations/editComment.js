import { gql } from '@apollo/client';
import { Fragment_commentThreelevels } from '../fragments/comment3level';

export const Mutation_editComment = gql`
  ${Fragment_commentThreelevels}
  mutation updateComment($commentId: String, $content: String) {
    updateComment(commentId: $commentId, content: $content) {
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
        ...commentThreelevels
      }
    }
  }
`;
