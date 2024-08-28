import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';

const CodeEditor = ({ initialCode, onChange, language }) => {
  const [code, setCode] = useState(initialCode || '');

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
      language={language} // Set the language dynamically
      value={code}
      theme="vs-dark"
      onChange={handleEditorChange}
    />
  );
};

export default CodeEditor;
