import React from 'react';
import { useQuery, gql } from '@apollo/client';

const ROOM_QUERY = gql`
  query GetRoom($id: ID!) {
    room(id: $id) {
      id
      name
      participants {
        id
        username
      }
    }
  }
`;

const Room = ({ roomId }) => {
  const { loading, error, data } = useQuery(ROOM_QUERY, {
    variables: { id: roomId },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h1>{data.room.name}</h1>
      <h2>Participants</h2>
      <ul>
        {data.room.participants.map((participant) => (
          <li key={participant.id}>{participant.username}</li>
        ))}
      </ul>
      {/* Code editor component will be added here */}
    </div>
  );
};

export default Room;
