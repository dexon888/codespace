const express = require('express');
const axios = require('axios');
const router = express.Router();

router.post('/generate-hint', async (req, res) => {
  const { problemDescription, currentCode } = req.body;

  try {
    console.log('Making a request to OpenAI with the following details:');
    console.log('API Key:', process.env.OPENAI_API_KEY);
    console.log('Problem Description:', problemDescription);
    console.log('Current Code:', currentCode);

    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant that provides hints for coding problems.',
        },
        {
          role: 'user',
          content: `Here is a coding problem: ${problemDescription}\nThe user has written the following code so far:\n${currentCode}\nWhat hint can you provide to help them solve the problem?`,
        },
      ],
      max_tokens: 250,
      temperature: 0.7,
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    const hint = response.data.choices[0].message.content.trim();
    res.json({ hint });
  } catch (error) {
    console.error('Error generating hint:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'Failed to generate hint' });
  }
});

module.exports = router;
