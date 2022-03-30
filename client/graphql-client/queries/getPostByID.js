import { gql } from '@apollo/client';
import { Fragment_commentThreelevels } from '../fragments/comment3level';
export const Query_getPostByID = gql`
  ${Fragment_commentThreelevels}

  query getPostByID($id: String) {
    getPostByID(id: $id) {
      network {
        code
        message
        success
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
