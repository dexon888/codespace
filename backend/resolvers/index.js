// /backend/resolvers/index.js

const roomResolvers = require('./roomResolvers');
// Import other resolvers here

const resolvers = {
  Query: {
    ...roomResolvers.Query,
    // Spread in queries from other resolvers here
  },
  Mutation: {
    ...roomResolvers.Mutation,
    // Spread in mutations from other resolvers here
  },
};

module.exports = resolvers;
