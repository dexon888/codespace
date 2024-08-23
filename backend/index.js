const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const cors = require('cors');  // Import CORS
const schema = require('./schemas');
const resolvers = require('./resolvers');

const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
});

const app = express();

app.use(cors());  // Enable CORS

server.start().then(() => {
  server.applyMiddleware({ app });

  app.listen({ port: process.env.PORT || 4000 }, () =>
    console.log(`Server ready at http://localhost:${process.env.PORT || 4000}${server.graphqlPath}`)
  );
});
