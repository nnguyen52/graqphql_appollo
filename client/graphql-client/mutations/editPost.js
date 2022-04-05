import { gql } from '@apollo/client';
import { Fragment_commentThreelevels } from '../fragments/comment3level';
import { Fragment_networkResponse } from '../fragments/networkResponse';
import { Fragment_postInfo } from '../fragments/postInfo';
import { Fragment_userInfo } from '../fragments/userInfo';
export const Mutation_editPost = gql`
  ${Fragment_networkResponse}
  ${Fragment_userInfo}
  ${Fragment_commentThreelevels}
  ${Fragment_postInfo}
  mutation updatePost($id: String, $title: String, $content: String) {
    updatePost(id: $id, title: $title, content: $content) {
      network {
        ...network
      }
      data {
        ...post
      }
    }
  }
`;
