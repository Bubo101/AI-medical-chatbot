import express from 'express';
import { OpenAI } from 'openai';
import dotenv from 'dotenv';
import cors from 'cors';

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

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
