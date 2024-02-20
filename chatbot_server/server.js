import express from 'express';
import { OpenAI } from 'openai';
import dotenv from 'dotenv';
import cors from 'cors';
import { setupDb } from './db.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;
app.use(cors());
app.use(express.json());

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Set up your database
setupDb().then(() => {
  console.log('Database setup completed.');
}).catch((error) => {
  console.error('Error setting up the database:', error);
});

// Your existing routes and server setup

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
