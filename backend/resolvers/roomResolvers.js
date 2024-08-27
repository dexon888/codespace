// /backend/resolvers/roomResolvers.js

let rooms = [];

const roomResolvers = {
  Query: {
    rooms: () => {
      console.log("Fetching rooms:", rooms);
      return rooms;
    },
  },
  Mutation: {
    createRoom: (_, { name }) => {
      const newRoom = { id: rooms.length + 1, name, participants: [] };
      rooms.push(newRoom);
      console.log("Room created:", newRoom);
      return newRoom;
    },
    joinRoom: (_, { roomId, userId }) => {
      console.log("Trying to join room with ID:", roomId);
      const room = rooms.find(room => room.id === Number(roomId));
      if (room) {
        console.log(`Before joining: Participants in room ${roomId}:`, room.participants);
        room.participants.push({ id: userId, username: `User ${userId}` });
        console.log(`User ${userId} joined room ${roomId}`);
        console.log(`After joining: Participants in room ${roomId}:`, room.participants);
        return room;
      }
      console.error(`Room ${roomId} not found`);
      throw new Error("Room not found");
    },
  },
};



module.exports = roomResolvers;
