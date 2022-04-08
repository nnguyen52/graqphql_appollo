import { gql } from '@apollo/client';
import { Fragment_commentThreelevels } from './comment3level';
import { Fragment_userInfo } from './userInfo';
export const Fragment_postInfo = gql`
  ${Fragment_commentThreelevels}
  ${Fragment_userInfo}
  fragment post on Post {
    _id
    userId
    user {
      ...user
    }
    title
    content
    points
    comments {
      ...commentThreelevels
    }
    images
    imageCover
    createdAt
  }
`;
