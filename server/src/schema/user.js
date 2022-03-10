import { gql } from 'apollo-server-express';
export default gql`
  type Query {
    users: [User!]
    user(id: ID!): User
  }
  type Mutation {
    register(userName: String!, email: String!, password: String!): UserMutationResponse
  }
  type User {
    id: ID!
    userName: String!
    email: String!
    # hide password
  }
`;
