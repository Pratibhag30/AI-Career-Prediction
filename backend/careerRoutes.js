const express = require('express');
const router = express.Router();
const User = require('./models/User');
require('dotenv').config();


const OpenAI = require('openai');


const openai = new OpenAI({
  apiKey: process.env.OPEN_API_KEY,
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
});



// API endpoint for career prediction
router.post('/predict-career', async (req, res) => {
  const { skills, interests, aptitude } = req.body;

  if (!skills || !interests || !aptitude) {
    return res.status(400).json({ success: false, message: 'Missing input fields' });
  }

  const prompt = `
Act as a career counselor AI. Given skills: [${skills}], interests: [${interests}], 
aptitude: [${aptitude}], suggest top 3 careers with roadmap, average salary, 
future growth, and 2-3 online courses from Udemy, Coursera.
`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gemini-2.0-flash",
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      stream: true,
    });


    let responseText = "";

    for await (const chunk of completion) {
      const delta = chunk.choices[0].delta;

      if (delta && delta.content) {
        console.log(delta.content);
        responseText += delta.content;
      }
    }

    console.log("Final response:", responseText);


    // Save user input and AI response to MongoDB
    const user = new User({ skills, interests, aptitude, response: responseText });
    await user.save();

    return res.json({ success: true, response: responseText });
  } catch (err) {
    console.error('OpenAI error:', err);
    return res.status(500).json({ success: false, message: 'Server error during prediction' });
  }
});

module.exports = router;
