import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';

const CodeEditor = ({ initialCode, onChange }) => {
  const [code, setCode] = useState(initialCode || '');

  // Update the editor content if the initialCode prop changes
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
      defaultLanguage="javascript"
      value={code}  // Use value instead of defaultValue
      theme="vs-dark"
      onChange={handleEditorChange}
    />
  );
};

export default CodeEditor;
