const express = require('express');
const axios = require('axios');
const { spawn, spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const router = express.Router();

router.post('/fetch-leetcode-problem', async (req, res) => {
  const { titleSlug } = req.body;
  
  try {
    const response = await axios.get(`https://alfa-leetcode-api.onrender.com/select?titleSlug=${titleSlug}`);
    
    const { questionTitle, question } = response.data;
    
    res.json({ title: questionTitle, content: question });
  } catch (error) {
    console.error('Error fetching the problem:', error);
    res.status(500).json({ error: 'Failed to fetch problem content' });
  }
});

router.post('/run-code', (req, res) => {
  const { code, language } = req.body;

  let command;
  let args;
  let filePath;

  switch (language) {
    case 'python':
      command = 'python3';
      args = ['-c', code];
      break;
    case 'javascript':
      command = 'node';
      args = ['-e', code];
      break;
    case 'java':
      // Write the Java code to a temporary file named Main.java
      filePath = path.join(__dirname, 'Main.java');
      fs.writeFileSync(filePath, code);

      // Compile the Java code
      const compile = spawnSync('javac', [filePath]);

      if (compile.stderr.toString()) {
        return res.json({ output: `Compilation Error: ${compile.stderr.toString()}` });
      }

      // Execute the compiled Java class
      const run = spawn('java', ['-cp', __dirname, 'Main']); // Use 'Main' to match the public class name

      let output = '';
      let errorOutput = '';

      run.stdout.on('data', (data) => {
        output += data.toString();
      });

      run.stderr.on('data', (data) => {
        errorOutput += data.toString();
      });

      run.on('close', (code) => {
        if (errorOutput) {
          res.json({ output: `Runtime Error: ${errorOutput}` });
        } else {
          res.json({ output: output.trim() });
        }
      });

      return;
    default:
      return res.json({ output: `Error: Unsupported language ${language}` });
  }

  const process = spawn(command, args);

  let output = '';
  let errorOutput = '';

  process.stdout.on('data', (data) => {
    output += data.toString();
  });

  process.stderr.on('data', (data) => {
    errorOutput += data.toString();
  });

  process.on('close', (code) => {
    if (errorOutput) {
      res.json({ output: `Error: ${errorOutput}` });
    } else {
      res.json({ output: output.trim() });
    }
  });
});

module.exports = router;
