import { gql } from '@apollo/client';
export const Fragment_userInfo = gql`
  fragment user on User {
    id
    userName
    email
    karma
  }
`;
