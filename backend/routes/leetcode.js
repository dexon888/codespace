const express = require('express');
const axios = require('axios');
const { spawn } = require('child_process'); // Import child_process to run Python scripts
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
  const { code } = req.body;

  const process = spawn('python3', ['-c', code]); // Spawn a child process to run Python code

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
