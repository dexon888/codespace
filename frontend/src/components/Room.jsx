import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import CodeEditor from './CodeEditor';

const socket = io('http://localhost:4000'); // Connect to your WebSocket server

const Room = () => {
  const [code, setCode] = useState('');

  useEffect(() => {
    // Listen for code updates from the server
    socket.on('code-update', (newCode) => {
      console.log('Code update received:', newCode);  // Add this log
      setCode(newCode);
    });

    // Clean up the socket connection on component unmount
    return () => {
      socket.off('code-update');
    };
  }, []);


  const handleCodeChange = (newCode) => {
    setCode(newCode);
    socket.emit('code-change', newCode); // Send the code change to the server
  };

  return (
    <div>
      <h1>Room</h1>
      <CodeEditor initialCode={code} onChange={handleCodeChange} />
    </div>
  );
};

export default Room;
