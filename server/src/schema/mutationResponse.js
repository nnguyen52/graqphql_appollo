import { gql } from "apollo-server-express";

export const ErrorType = gql`
  type Error {
    field: String
    message: String
  }
`;
export default gql`
  type MutationResponse {
    code: Int
    success: Boolean
    message: String
    errors: [Error!]
  }
`;
