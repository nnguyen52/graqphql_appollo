import { gql } from '@apollo/client';
import { Fragment_commentThreelevels } from '../fragments/comment3level';
import { Fragment_networkResponse } from '../fragments/networkResponse';
import { Fragment_postInfo } from '../fragments/postInfo';
import { Fragment_userInfo } from '../fragments/userInfo';

export const Mutation_createPost = gql`
  ${Fragment_networkResponse}
  ${Fragment_userInfo}
  ${Fragment_commentThreelevels}
  ${Fragment_postInfo}
  mutation createPost($title: String, $content: String, $publicIDs: [String]) {
    createPost(title: $title, content: $content, publicIDs: $publicIDs) {
      network {
        ...network
      }
      data {
        ...post
      }
    }
  }
`;
