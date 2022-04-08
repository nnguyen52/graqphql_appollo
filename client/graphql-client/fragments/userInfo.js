import { gql } from '@apollo/client';
export const Fragment_userInfo = gql`
  fragment user on User {
    _id
    userName
    email
    karma
    avatar
    about
  }
`;
