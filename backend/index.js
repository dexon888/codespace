const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const http = require('http'); // Import http to create a server
const cors = require('cors');
const { Server } = require('socket.io'); // Import Socket.IO
const schema = require('./schemas');
const resolvers = require('./resolvers');

const startServer = async () => {
  const app = express();
  app.use(cors()); // Enable CORS

  const server = http.createServer(app); // Create an HTTP server

  // Initialize Apollo Server
  const apolloServer = new ApolloServer({
    typeDefs: schema,
    resolvers,
  });

  await apolloServer.start();
  apolloServer.applyMiddleware({ app });

  // Set up Socket.IO
  const io = new Server(server, {
    cors: {
      origin: '*', // Adjust this according to your client origin
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Listen for code changes and broadcast them to other users
    socket.on('code-change', (newCode) => {
      console.log('Code change received:', newCode);
      socket.broadcast.emit('code-update', newCode);
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });

  const PORT = process.env.PORT || 4000;
  server.listen(PORT, () => {
    console.log(`Server ready at http://localhost:${PORT}${apolloServer.graphqlPath}`);
    console.log(`WebSocket server running on port ${PORT}`);
  });
};

startServer();
