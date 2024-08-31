const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const schema = require('./schemas');
const resolvers = require('./resolvers');
const leetcodeRoutes = require('./routes/leetcode'); // Import the Leetcode route handler
const hintRoutes = require('./routes/hint');
require('dotenv').config(); 

const startServer = async () => {
  const app = express();

  // Enable CORS with specific origins
  app.use(cors({
    origin: ["http://localhost:3000", "https://codespace-6399.onrender.com"], // Both localhost and deployed frontend URL
    methods: ["GET", "POST"],
    credentials: true // Allow credentials (cookies, authorization headers, etc.)
  }));

  app.use(express.json()); // Enable JSON body parsing
  
  const server = http.createServer(app); // Create an HTTP server

  // Initialize Apollo Server
  const apolloServer = new ApolloServer({
    typeDefs: schema,
    resolvers,
  });

  await apolloServer.start();
  apolloServer.applyMiddleware({ app });

  // Use the Leetcode API routes
  app.use('/leetcode', leetcodeRoutes); 
  app.use('/hint', hintRoutes);

  // Set up Socket.IO with CORS configuration
  const io = new Server(server, {
    cors: {
      origin: ["http://localhost:3000", "https://codespace-6399.onrender.com"], // Include both your local dev URL and deployed frontend URL
      methods: ["GET", "POST"],
      credentials: true // Allow credentials (cookies, authorization headers, etc.)
    },
  });

  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Listen for code changes and broadcast them to other users
    socket.on('code-change', (newCode) => {
      console.log('Code change received:', newCode);
      socket.broadcast.emit('code-update', newCode);
    });

    socket.on('problem-change', (newProblemContent) => {
      console.log('Problem change received:', newProblemContent);
      socket.broadcast.emit('problem-update', newProblemContent);
    });

    socket.on('output-change', (newOutput) => {
      console.log('Output change received:', newOutput);
      socket.broadcast.emit('output-update', newOutput);
    });

    // Listen for language changes and broadcast them to other users
    socket.on('language-change', (newLanguage) => {
      console.log('Language change received:', newLanguage);
      socket.broadcast.emit('language-update', newLanguage);
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });

  const PORT = process.env.PORT || 4000;
  server.listen(PORT, () => {
    console.log(`Server ready at ${PORT}${apolloServer.graphqlPath}`);
    console.log(`WebSocket server running on port ${PORT}`);
  });

};

startServer();
