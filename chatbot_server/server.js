require('dotenv').config(); // Load environment variables from .env

// Require the necessary modules
const express = require('express');
const { Configuration, OpenAIApi } = require('openai');
const { Pool } = require('pg');

// Initialize the Express app
const app = express();
const port = process.env.PORT || 3001; // You can choose a different port for backend

app.use(express.json()); // Middleware for parsing application/json

// OpenAI configuration
const openAIConfiguration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY, // Make sure to set this in your .env file or environment
});
const openai = new OpenAIApi(openAIConfiguration);

// PostgreSQL client setup
const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // Ensure this is set in your environment
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
});

// Test endpoint
app.get('/', (req, res) => {
  res.send('Chatbot Server is running!');
});

// Chat endpoint
app.post('/chat', async (req, res) => {
  try {
    const prompt = req.body.prompt;
    const response = await openai.createCompletion({
      model: "text-davinci-003", // Use an appropriate model
      prompt: prompt,
      temperature: 0.7,
      max_tokens: 150,
    });
    res.json({ response: response.data.choices[0].text.trim() });
  } catch (error) {
    console.error("Error calling OpenAI:", error);
    res.status(500).json({ error: "Error processing your request" });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
