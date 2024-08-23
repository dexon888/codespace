import React, { useState } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';

const ROOMS_QUERY = gql`
  query GetRooms {
    rooms {
      id
      name
      participants {
        id
        username
      }
    }
  }
`;

const CREATE_ROOM_MUTATION = gql`
  mutation CreateRoom($name: String!) {
    createRoom(name: $name) {
      id
      name
    }
  }
`;

const Lobby = () => {
  const { loading, error, data } = useQuery(ROOMS_QUERY);
  const [createRoom] = useMutation(CREATE_ROOM_MUTATION);
  const [roomName, setRoomName] = useState('');

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const handleCreateRoom = async () => {
    if (roomName.trim() === '') return;
    await createRoom({ variables: { name: roomName } });
    setRoomName(''); // Clear the input field after creating the room
  };

  return (
    <div>
      <h1>Lobby</h1>
      <div>
        <input
          type="text"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          placeholder="Room Name"
        />
        <button onClick={handleCreateRoom}>Create Room</button>
      </div>
      <div>
        <h2>Available Rooms</h2>
        <ul>
          {data.rooms.map((room) => (
            <li key={room.id}>
              {room.name} ({room.participants.length} participants)
              {/* Add a join room button/link here */}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Lobby;
