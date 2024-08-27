import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import CodeEditor from './CodeEditor';
import './Room.css'; // Import CSS for styling

const socket = io('http://localhost:4000'); // Connect to your WebSocket server

const Room = () => {
  const [code, setCode] = useState('');
  const [problemContent, setProblemContent] = useState(''); // State for Leetcode problem content

  useEffect(() => {
    // Listen for code updates from the server
    socket.on('code-update', (newCode) => {
      console.log('Code update received:', newCode); 
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

  const handleFetchRandomProblem = () => {
    // Simulate fetching a random Leetcode problem
    setProblemContent('Random Leetcode Problem Content');
  };

  const handleSearchProblem = () => {
    const url = document.getElementById('problem-url').value;
    // Simulate fetching Leetcode problem from URL
    setProblemContent(`Content fetched from ${url}`);
  };

  return (
    <div className="room-container">
      <div className="left-panel">
        <div className="problem-actions">
          <button onClick={handleFetchRandomProblem}>Show Random Problem</button>
          <div className="search-bar">
            <input type="text" id="problem-url" placeholder="Enter Leetcode URL" />
            <button onClick={handleSearchProblem}>Load Problem</button>
          </div>
        </div>
        <div className="problem-content">
          <h3>Leetcode Problem</h3>
          <p>{problemContent}</p>
        </div>
      </div>
      <div className="right-panel">
        <CodeEditor initialCode={code} onChange={handleCodeChange} />
      </div>
    </div>
  );
};

export default Room;
