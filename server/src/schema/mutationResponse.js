import { gql } from 'apollo-server-express';

export const ErrorType = gql`
  type Error {
    field: String
    detailedMessage: String
  }
`;
export const ErrorsType = gql`
  type Errors {
    message: String
    details: [Error!]
  }
`;

export default gql`
  type MutationResponse {
    code: Int
    success: Boolean
    message: String
    errors: [Errors!]
  }
`;
