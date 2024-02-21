import express from 'express';
import { OpenAI } from 'openai';
import dotenv from 'dotenv';
import cors from 'cors';
import { setupDb, insertFeedback, openDb, insertSession, setupSessionDb } from './db.js'; // Import setupDb from db.js

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;
app.use(cors());

/* 
use this when deployed:  
app.use(cors({
  origin: 'http://your-react-app-origin.com'
})); 
*/

app.use(express.json());

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const botContext = {role: "system", content: "Your name is Uro. You are a helpful urology specialist giving advice only about urology and urology surgery for patients."}

// Set up your database
setupDb().then(() => {
  console.log('Database setup completed.');
}).catch((error) => {
  console.error('Error setting up the database:', error);
});

setupSessionDb().catch(console.error);

app.post('/start-session', async (req, res) => {
  console.log('Recieved start session request')
  try {
    await insertSession();
    res.send({ message: 'Session started' });
  } catch (error) {
    console.error("Error starting a new session:", error);
    res.status(500).json({ error: "Error processing your request" });
  }
});

// Your existing chat endpoint
app.post('/chat', async (req, res) => {
  try {
    const userMessages = req.body.messages;
    const messagesToSend = [botContext, ...userMessages];

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo-0125",
      messages: messagesToSend,
    });

    res.json({ response: completion.choices[0].message.content.trim() });
  } catch (error) {
    console.error("Error calling OpenAI:", error);
    res.status(500).json({ error: "Error processing your request" });
  }
});

// Feedback submission endpoint
app.post('/submit-feedback', async (req, res) => {
  const { helpful } = req.body; // Assuming helpful is a boolean value
  try {
    // Import the function to insert feedback from db.js (assuming it's exported from there)
    await insertFeedback(helpful);
    res.send('Feedback submitted successfully');
  } catch (error) {
    console.error('Error submitting feedback:', error);
    res.status(500).send('Error submitting feedback');
  }
});

app.get('/feedback-percentage', async (req, res) => {
  try {
    const db = await openDb();
    const totalFeedback = await db.get("SELECT COUNT(*) as count FROM feedback");
    const positiveFeedback = await db.get("SELECT COUNT(*) as count FROM feedback WHERE helpful = 1");
    if (totalFeedback.count > 0) {
      const percentage = Math.round((positiveFeedback.count / totalFeedback.count) * 100);
      res.json({ percentage });
    } else {
      res.json({ percentage: "No feedback yet" });
    }
  } catch (error) {
    console.error("Error fetching feedback percentage:", error);
    res.status(500).json({ error: "Error processing your request" });
  }
});

app.get('/user-metrics', async (req, res) => {
  try {
    const db = await openDb();
    const { total: totalSessions } = await db.get("SELECT COUNT(*) as total FROM sessions");

    const { total: totalFeedbacks } = await db.get("SELECT COUNT(*) as total FROM feedback");

    const { total: positiveFeedbacks } = await db.get("SELECT COUNT(*) as total FROM feedback WHERE helpful = 1");

    const percentHelpful = totalFeedbacks > 0 ? Math.round((positiveFeedbacks / totalFeedbacks) * 100) : 0;

    const percentSessionsWithFeedback = totalSessions > 0 ? Math.round((totalFeedbacks / totalSessions) * 100) : 0;

    res.json({
      totalSessions,
      totalFeedbacks,
      percentHelpful,
      percentSessionsWithFeedback,
    });
  } catch (error) {
    console.error("Error fetching session and feedback data:", error);
    res.status(500).json({ error: "Error processing your request" });
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
