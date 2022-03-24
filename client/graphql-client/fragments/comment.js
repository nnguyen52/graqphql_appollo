import { gql } from '@apollo/client';

export const Fragment_comment = gql`
  fragment comment on Comment {
    _id
    content
    points
    user {
      id
      userName
      email
    }
    tag {
      id
      userName
      email
    }
    postId
  }
`;
