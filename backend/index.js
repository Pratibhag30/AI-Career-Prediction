
// require('dotenv').config();
// const express = require('express');
// const session = require('express-session');
// const bodyParser = require('body-parser');
// const path = require('path');
// const { Configuration, OpenAIApi } = require('openai');

// const app = express();
// const port = process.env.PORT || 3000;

// // OpenAI setup
// const configuration = new Configuration({
//   apiKey: process.env.OPENAI_API_KEY,
// });
// const openai = new OpenAIApi(configuration);

// // Middleware
// app.use(express.static(path.join(__dirname, 'public')));
// app.use(bodyParser.json());
// app.use(session({
//   secret: 'your-secret-key',
//   resave: false,
//   saveUninitialized: false,
// }));

// // Hardcoded user credentials for demo
// const USER_CREDENTIALS = {
//   username: "student",
//   password: "password"
// };

// // API endpoint to login
// app.post('/login', (req, res) => {
//   const { username, password } = req.body;
//   if(username === USER_CREDENTIALS.username && password === USER_CREDENTIALS.password) {
//     req.session.user = { username };
//     res.json({ success: true, username });
//   } else {
//     res.status(401).json({ success: false, message: 'Invalid credentials' });
//   }
// });

// // API endpoint to logout
// app.post('/logout', (req, res) => {
//   req.session.destroy(err => {
//     if(err) {
//       return res.status(500).json({ success: false, message: 'Logout failed' });
//     }
//     res.json({ success: true });
//   });
// });

// // API endpoint to check session
// app.get('/session', (req, res) => {
//   if(req.session.user) {
//     res.json({ loggedIn: true, username: req.session.user.username });
//   } else {
//     res.json({ loggedIn: false });
//   }
// });

// // API endpoint for career prediction using OpenAI
// app.post('/predict-career', async (req, res) => {
//   if(!req.session.user) {
//     return res.status(401).json({ success: false, message: 'Not authenticated' });
//   }

//   const { skills, interests, aptitude } = req.body;

//   if(!skills || !interests || !aptitude) {
//     return res.status(400).json({ success: false, message: 'Missing input fields' });
//   }

//   // Construct prompt for career prediction
//   const prompt = `
// You are an expert career counselor AI. Based on the student's skills, interests, and aptitude, suggest a suitable career option, a detailed roadmap on how to achieve that career, and recommended courses for that career. 

// Input format:
// Skills: ${skills.join(', ')}
// Interests: ${interests.join(', ')}
// Aptitude: ${aptitude}

// Output format: JSON object with fields "career", "roadmap" (array of steps), and "courses" (array of course names)
  
// Example output:
// {
//   "career": "Software Developer",
//   "roadmap": [
//     "Learn programming basics",
//     "Practice data structures and algorithms",
//     "Build projects",
//     "Apply for internships",
//     "Prepare for interviews"
//   ],
//   "courses": [
//     "CS50's Introduction to Computer Science (edX)",
//     "Data Structures and Algorithms (Coursera)",
//     "Java Programming Masterclass (Udemy)"
//   ]
// }

// Now provide only the JSON output (nothing else).`;

//   try {
//     const completion = await openai.createChatCompletion({
//       model: "gpt-4o-mini",
//       messages: [{ role: 'user', content: prompt }],
//       temperature: 0.7,
//       max_tokens: 400,
//     });

//     let responseText = completion.data.choices[0].message.content.trim();

//     // Try to parse JSON from AI response (handle possible extra text)
//     let jsonStart = responseText.indexOf("{");
//     let jsonEnd = responseText.lastIndexOf("}");

//     if(jsonStart !== -1 && jsonEnd !== -1) {
//       const jsonString = responseText.substring(jsonStart, jsonEnd + 1);
//       const data = JSON.parse(jsonString);
//       return res.json({ success: true, data });
//     } else {
//       // fallback if AI doesn't return expected JSON
//       return res.status(500).json({ success: false, message: 'Invalid response from AI' });
//     }

//   } catch(err) {
//     console.error('OpenAI error:', err);
//     return res.status(500).json({ success: false, message: 'Server error during prediction' });
//   }
// });

// app.listen(port, () => {
//   console.log(`Server running on http://localhost:${port}`);
// });



require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const careerRoutes = require('./careerRoutes');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.static(path.join(__dirname, '..', 'frontend')));
app.use(bodyParser.json());
app.use(express.static('frontend'));
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false,
}));

// MongoDB connection
mongoose.connect('mongodb://127.0.0.1:27017/careerAI')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api', careerRoutes);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
