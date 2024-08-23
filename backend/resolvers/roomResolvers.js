// /backend/resolvers/roomResolvers.js

let rooms = [];

const roomResolvers = {
  Query: {
    rooms: () => rooms,
  },
  Mutation: {
    createRoom: (_, { name }) => {
      const newRoom = { id: rooms.length + 1, name, participants: [] };
      rooms.push(newRoom);
      return newRoom;
    },
    joinRoom: (_, { roomId, userId }) => {
      const room = rooms.find(room => room.id === roomId);
      if (room) {
        room.participants.push({ id: userId, username: `User ${userId}` });
        return room;
      }
      throw new Error('Room not found');
    },
  },
};

module.exports = roomResolvers;
