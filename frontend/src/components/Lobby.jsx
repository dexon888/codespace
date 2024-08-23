import React, { useState } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';
import { useNavigate } from 'react-router-dom';

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
      participants {
        id
        username
      }
    }
  }
`;

const JOIN_ROOM_MUTATION = gql`
  mutation JoinRoom($roomId: ID!, $userId: ID!) {
    joinRoom(roomId: $roomId, userId: $userId) {
      id
      name
      participants {
        id
        username
      }
    }
  }
`;

const Lobby = () => {
  const { loading, error, data } = useQuery(ROOMS_QUERY);
  const [createRoom] = useMutation(CREATE_ROOM_MUTATION);
  const [joinRoom] = useMutation(JOIN_ROOM_MUTATION);
  const [roomName, setRoomName] = useState('');
  const navigate = useNavigate();

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const handleCreateRoom = async () => {
    if (!roomName.trim()) return;
    try {
      const { data, errors } = await createRoom({ variables: { name: roomName } });
      if (errors) {
        console.error("GraphQL errors:", errors);
      }
      console.log("Room created:", data.createRoom);
      setRoomName('');
      navigate(`/room/${data.createRoom.id}`);
    } catch (error) {
      console.error("Mutation error:", error);
      alert("Failed to create room. Please try again.");
    }
  };

  const handleJoinRoom = async (roomId) => {
    try {
      const userId = 1; // Replace with the actual user ID from your auth system
      const { data, errors } = await joinRoom({ variables: { roomId, userId } });
      if (errors) {
        console.error("GraphQL errors:", errors);
      }
      console.log("Room joined:", data.joinRoom);
      navigate(`/room/${roomId}`);
    } catch (error) {
      console.error("Mutation error:", error);
      alert("Failed to join room. Please try again.");
    }
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
              <button onClick={() => handleJoinRoom(room.id)}>Join Room</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Lobby;
