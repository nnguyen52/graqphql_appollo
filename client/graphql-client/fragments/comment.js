import { gql } from '@apollo/client';
import { Fragment_userInfo } from '../fragments/userInfo';
export const Fragment_comment = gql`
  ${Fragment_userInfo}
  fragment comment on Comment {
    _id
    content
    points
    user {
      ...user
    }
    tag {
      ...user
    }
    postId
  }
`;
