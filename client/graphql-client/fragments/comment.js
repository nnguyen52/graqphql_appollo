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
      karma
    }
    tag {
      id
      userName
      email
      karma
    }
    postId
  }
`;
