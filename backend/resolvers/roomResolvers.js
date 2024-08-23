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
      if (!name) {
        console.error("Room name is required.");
        throw new Error("Room name is required.");
      }

      const newRoom = { id: rooms.length + 1, name, participants: [] };
      rooms.push(newRoom);

      console.log("Room created:", newRoom);
      return newRoom;
    },
    joinRoom: (_, { roomId, userId }) => {
      console.log("Trying to join room with ID:", roomId);
      const room = rooms.find((room) => room.id === Number(roomId));
      if (room) {
        room.participants.push({ id: userId, username: `User ${userId}` });
        console.log(`User ${userId} joined room ${roomId}`);
        return room;
      }

      console.error(`Room ${roomId} not found`);
      throw new Error("Room not found");
    },
  },
};

module.exports = roomResolvers;
