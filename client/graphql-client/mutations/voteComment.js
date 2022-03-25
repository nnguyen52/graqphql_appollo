import { gql } from '@apollo/client';
import { Fragment_commentThreelevels } from '../fragments/comment3level';
export const Mutation_voteComment = gql`
  ${Fragment_commentThreelevels}

  mutation voteComment($commentId: String, $voteValue: Int) {
    voteComment(commentId: $commentId, voteValue: $voteValue) {
      network {
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
