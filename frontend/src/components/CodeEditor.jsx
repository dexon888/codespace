import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';

const CodeEditor = ({ initialCode, onChange }) => {
  const [code, setCode] = useState(initialCode || '');

  // Sync the internal state with the external prop whenever it changes
  useEffect(() => {
    setCode(initialCode);
  }, [initialCode]);

  const handleEditorChange = (value) => {
    setCode(value);
    if (onChange) {
      onChange(value);
    }
  };

  return (
    <Editor
      height="90vh"
      language="python" 
      value={code}
      theme="vs-dark"
      onChange={handleEditorChange}
    />
  );
};

export default CodeEditor;
