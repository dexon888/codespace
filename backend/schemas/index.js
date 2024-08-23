// /backend/schemas/index.js

const { gql } = require('apollo-server-express');
const roomSchema = require('./roomSchema');
// Import other schemas here

const baseSchema = gql`
  type Query
  type Mutation
`;

const schema = [baseSchema, roomSchema];
// Add other schemas to the array as needed

module.exports = schema;
