import React, { useEffect, useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useQuery, useMutation, gql } from '@apollo/client';
import { useAuth0 } from '@auth0/auth0-react';
import './Lobby.css'; // Import the new CSS for styling

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

const Lobby = () => {
  const { loading, error, data } = useQuery(ROOMS_QUERY);
  const [createRoom] = useMutation(CREATE_ROOM_MUTATION);
  const [roomName, setRoomName] = useState('');
  const navigate = useNavigate();

  const { isAuthenticated } = useAuth0();

  if (!isAuthenticated) {
    return <Navigate to="/auth" />;
  }

  const handleCreateRoom = async () => {
    if (roomName.trim() === '') return;

    const result = await createRoom({ variables: { name: roomName } });
    navigate(`/room/${result.data.createRoom.id}`);
  };

  const handleJoinRoom = (roomId) => {
    navigate(`/room/${roomId}`);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="lobby-container">
      <h1 className="lobby-title">Welcome to CodeSync</h1>
      <h2 className="lobby-subtitle">Join or Create a Room</h2>
      <div className="room-creation">
        <input
          type="text"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          placeholder="Enter Room Name"
          className="room-input"
        />
        <button onClick={handleCreateRoom} className="create-room-button">Create Room</button>
      </div>
      <div className="rooms-list">
        <h3>Available Rooms</h3>
        <ul>
          {data.rooms.map((room) => (
            <li key={room.id} className="room-item">
              <span>{room.name} ({room.participants.length} participants)</span>
              <button onClick={() => handleJoinRoom(room.id)} className="join-room-button">Join Room</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Lobby;
