const express = require('express');
const axios = require('axios');
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

  try {
    let output = '';
    const captureLog = (...args) => {
      output += args.join(' ') + '\n';
    };

    // Temporarily override console.log to capture output
    const originalConsoleLog = console.log;
    console.log = captureLog;

    eval(code); // Warning: eval() is unsafe for production

    // Restore original console.log function
    console.log = originalConsoleLog;

    res.json({ output: output.trim() || 'undefined' });
  } catch (error) {
    res.json({ output: `Error: ${error.message}` });
  }
});

module.exports = router;
