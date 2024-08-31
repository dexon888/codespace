import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import CodeEditor from './CodeEditor';
import './Room.css';

const socket = io('http://localhost:4000');

const languageTemplates = {
  python: `# Necessary imports for a Leetcode problem
import sys
import collections
import math

def main():
    # Your code here
    pass

if __name__ == "__main__":
    main()
  `,
  javascript: `// Necessary imports for a Leetcode problem

function main() {
    // Your code here
}

main();
  `,
  java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        // Your code here
    }
}
  `
  // Add more templates for other languages if needed
};

const Room = () => {
  const [language, setLanguage] = useState('python'); // Default to Python
  const [code, setCode] = useState(languageTemplates[language]); 
  const [problemContent, setProblemContent] = useState('');
  const [output, setOutput] = useState('');
  const [hint, setHint] = useState(''); // State for storing the hint

  useEffect(() => {
    socket.on('code-update', (newCode) => {
      setCode(newCode);
    });

    socket.on('problem-update', (newProblemContent) => {
      setProblemContent(newProblemContent);
      setHint(''); // Clear the hint when a new problem is loaded
    });

    socket.on('output-update', (newOutput) => {
      setOutput(newOutput);
    });

    // Listen for language updates from the server
    socket.on('language-update', (newLanguage) => {
      setLanguage(newLanguage);
      setCode(languageTemplates[newLanguage]); // Update code template based on the new language
    });

    return () => {
      socket.off('code-update');
      socket.off('problem-update');
      socket.off('output-update');
      socket.off('language-update'); // Clean up the listener on unmount
    };
  }, []);

  const handleCodeChange = (newCode) => {
    setCode(newCode);
    socket.emit('code-change', newCode);
  };

  const handleLanguageChange = (event) => {
    const selectedLanguage = event.target.value;
    setLanguage(selectedLanguage);
    setCode(languageTemplates[selectedLanguage]); // Update local code template
    socket.emit('language-change', selectedLanguage); // Emit the language change event
  };

  const handleRunCode = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/run-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code, language }), // Send the selected language to the backend
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

    // Split the URL and remove empty strings
    const parts = url.split('/').filter(Boolean);

    // Find the index of "problems" and extract the next part as the titleSlug
    const problemIndex = parts.indexOf('problems');
    const titleSlug = problemIndex !== -1 && parts[problemIndex + 1] ? parts[problemIndex + 1] : '';

    if (!titleSlug) {
        console.error('Invalid Leetcode URL');
        return;
    }

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
        setHint('');  // Clear any existing hint when a new problem is loaded
        socket.emit('problem-change', problem.content);
      }
    } catch (error) {
      console.error('Failed to fetch the problem content:', error);
    }
};


  // Function to handle the Get Hint button click
  const handleGetHint = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/generate-hint', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ problemDescription: problemContent, currentCode: code }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setHint(result.hint); // Update the hint state with the received hint
    } catch (error) {
      console.error('Failed to fetch hint:', error);
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
          <div className="language-selection">
            <label htmlFor="language-select">Language:</label>
            <select id="language-select" value={language} onChange={handleLanguageChange}>
              <option value="python">Python</option>
              <option value="javascript">JavaScript</option>
              <option value="java">Java</option>
              {/* Add more languages as needed */}
            </select>
          </div>
          {/* Add the Get Hint button */}
          <button onClick={handleGetHint} className="hint-button">Get Hint</button>
        </div>
        <div className="problem-content">
          <h3>Leetcode Problem</h3>
          <div className="problem-description" dangerouslySetInnerHTML={{ __html: problemContent }}></div>
          {/* Display the hint if available */}
          {hint && (
            <div className="hint-section">
              <h3>Hint:</h3>
              <p>{hint}</p>
            </div>
          )}
        </div>
      </div>
      <div className="right-panel">
        <CodeEditor initialCode={code} onChange={handleCodeChange} language={language} />
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
