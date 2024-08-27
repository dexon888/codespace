const express = require('express');
const axios = require('axios');
const router = express.Router();

router.post('/fetch-leetcode-problem', async (req, res) => {
  const { titleSlug } = req.body;
  
  try {
    const response = await axios.get(`https://alfa-leetcode-api.onrender.com/select?titleSlug=${titleSlug}`);
    
    // Extract the required details from the response
    const { questionTitle, question } = response.data;
    
    res.json({ title: questionTitle, content: question });
  } catch (error) {
    console.error('Error fetching the problem:', error);
    res.status(500).json({ error: 'Failed to fetch problem content' });
  }
});

module.exports = router;
