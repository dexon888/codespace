// /backend/schemas/roomSchema.js

const { gql } = require('apollo-server-express');

const roomSchema = gql`
  type User {
    id: ID!
    username: String!
  }

  type Room {
    id: ID!
    name: String!
    participants: [User!]!
  }

  type Query {
    rooms: [Room!]!
  }

  type Mutation {
    createRoom(name: String!): Room!
    joinRoom(roomId: ID!, userId: ID!): Room!
  }
`;

module.exports = roomSchema;
