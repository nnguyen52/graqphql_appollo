import { gql } from '@apollo/client';
export const Fragment_pageInfo = gql`
  fragment pageInfo on pagination {
    hasNextPage
    endCursor
  }
`;
