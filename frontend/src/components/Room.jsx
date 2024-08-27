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

    // Listen for problem updates from the server
    socket.on('problem-update', (newProblemContent) => {
      console.log('Problem update received:', newProblemContent);
      setProblemContent(newProblemContent);
    });

    // Clean up the socket connection on component unmount
    return () => {
      socket.off('code-update');
      socket.off('problem-update');
    };
  }, []);

  const handleCodeChange = (newCode) => {
    setCode(newCode);
    socket.emit('code-change', newCode); // Send the code change to the server
  };

 const handleSearchProblem = async () => {
    const url = document.getElementById('problem-url').value;

    const titleSlug = url.split('/').filter(Boolean).pop(); // e.g., "climbing-stairs"
    
    try {
      const response = await fetch('http://localhost:4000/api/fetch-leetcode-problem', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ titleSlug }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const problem = await response.json();
      if (problem && problem.content) {
        setProblemContent(problem.content);
        socket.emit('problem-change', problem.content);
      }
    } catch (error) {
      console.error('Failed to fetch the problem content:', error);
    }
  };

  const handleFetchRandomProblem = () => {
    const simulatedRandomProblem = 'Random Leetcode Problem Content';
    setProblemContent(simulatedRandomProblem);
    socket.emit('problem-change', simulatedRandomProblem);
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
          <div className="problem-description" dangerouslySetInnerHTML={{ __html: problemContent }}></div>
        </div>
      </div>
      <div className="right-panel">
        <CodeEditor initialCode={code} onChange={handleCodeChange} />
      </div>
    </div>
  );
};

export default Room;
