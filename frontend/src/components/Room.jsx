import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import CodeEditor from './CodeEditor';
import './Room.css';

const socket = io('http://localhost:4000');

const Room = () => {
  const defaultPythonCode = `# Necessary imports for a Leetcode problem
import sys
import collections
import math

def main():
    # Your code here
    pass

if __name__ == "__main__":
    main()
  `;

  const [code, setCode] = useState(defaultPythonCode); 
  const [problemContent, setProblemContent] = useState('');
  const [output, setOutput] = useState('');

  useEffect(() => {
    // Listen for code updates from the server
    socket.on('code-update', (newCode) => {
      console.log('Code update received:', newCode);  // Debugging line
      setCode(newCode);
    });

    // Listen for problem updates from the server
    socket.on('problem-update', (newProblemContent) => {
      console.log('Problem update received:', newProblemContent);  // Debugging line
      setProblemContent(newProblemContent);
    });

    // Listen for output updates from the server
    socket.on('output-update', (newOutput) => {
      console.log('Output update received:', newOutput);  // Debugging line
      setOutput(newOutput);
    });

    return () => {
      socket.off('code-update');
      socket.off('problem-update');
      socket.off('output-update');
    };
  }, []);

  const handleCodeChange = (newCode) => {
    setCode(newCode);
    socket.emit('code-change', newCode);
  };

  const handleRunCode = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/run-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      });

      const result = await response.json();
      setOutput(result.output);
      socket.emit('output-change', result.output);
    } catch (error) {
      setOutput(`Error: ${error.message}`);
    }
  };

  const handleSearchProblem = async () => {
    const url = document.getElementById('problem-url').value;
    const titleSlug = url.split('/').filter(Boolean).pop();

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

  return (
    <div className="room-container">
      <div className="left-panel">
        <div className="problem-actions">
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
        <button onClick={handleRunCode} className="run-button">Run Code</button>
        <div className="output-panel">
          <h3>Output</h3>
          <pre>{output}</pre>
        </div>
      </div>
    </div>
  );
};

export default Room;
