import { gql } from '@apollo/client';
import { Fragment_commentThreelevels } from '../fragments/comment3level';
import { Fragment_networkResponse } from '../fragments/networkResponse';
import { Fragment_userInfo } from '../fragments/userInfo';
export const Mutation_createPost = gql`
  ${Fragment_networkResponse}
  ${Fragment_userInfo}
  ${Fragment_commentThreelevels}
  mutation createPost($title: String, $content: String) {
    createPost(title: $title, content: $content) {
      network {
        ...network
      }
      data {
        userId
        _id
        user {
          ...user
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
