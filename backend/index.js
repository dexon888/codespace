// /backend/index.js

const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const schema = require('./schemas');
const resolvers = require('./resolvers'); // Ensure this matches your resolvers' path

const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
});

const app = express();
server.start().then(() => {
  server.applyMiddleware({ app });

  app.listen({ port: process.env.PORT || 4000 }, () =>
    console.log(`Server ready at http://localhost:${process.env.PORT || 4000}${server.graphqlPath}`)
  );
});
