import { gql } from 'apollo-server-express';

export default gql`
  type Query {
    me: UserMutationResponse
    users: [User!]
    user(id: ID!): User
  }
  input newUserInfo {
    userName: String
    password: String
    email: String
  }
  type Mutation {
    verifyPassword(password: String, email: String): UserMutationResponse
    register(userName: String!, email: String!, password: String!): UserMutationResponse
    login(userNameOrEmail: String!, password: String!): UserMutationResponse
    logout: Boolean
    forgotPassword(email: String!): UserMutationResponse
    changePassword(token: String!, userId: String!, newPassword: String!): UserMutationResponse
    editMe(newUserInfo: newUserInfo): UserMutationResponse
    confirmingDeleteAccount(email: String): UserMutationResponse
    deleteAccount(type: String, token: String): UserMutationResponse
  }
  type User {
    id: ID
    userName: String
    email: String
    # hide password
  }
`;
