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
  mutation updatePost(
    $id: String
    $title: String
    $content: String
    $publicIDs: [String]
    $imgCoverFile: Upload
  ) {
    updatePost(
      id: $id
      title: $title
      content: $content
      publicIDs: $publicIDs
      imgCoverFile: $imgCoverFile
    ) {
      network {
        ...network
      }
      data {
        ...post
      }
    }
  }
`;
