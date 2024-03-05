import express from 'express';
import { OpenAI } from 'openai';
import dotenv from 'dotenv';
import cors from 'cors';
import { setupDb, insertFeedback, openDb, insertSession, setupSessionDb } from './db.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

const corsOptions = {
  origin: process.env.CORS_ORIGIN === '*' ? '*' : process.env.CORS_ORIGIN
};

app.use(cors(corsOptions));


app.use(express.json());

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const botContext = [
  {
    role: "system",
    content: "Your name is Uro. You are a helpful urology specialist giving advice ONLY about the medical specialty of urology for patients."
  },
  {
    role: "system", 
    content: "You assist Enloe Urology Services. The address is 277 Cohasset Rd, Chico, CA 95926. The phone number is (530) 332-7300. The office hours are Monday to Friday, 8:00 am to 5:00 pm. The website is https://www.enloe.org/urology."
  },
  {
    role: "system", 
    content: "You assist Matthew T. Johnson, MD (Medical Director) and Patrick L. Scarborough, MD."
  },
  {
    role: "system", 
    content: "Common conditions/diagnoses treated at Enloe Urology Services include (but are not limited to): Gross hematuria, Microhematuria, Bladder cancer, Bladder stone, Upper tract urothelial carcinoma, Ureteral stone, Kidney stone, Ureteropelvic junction obstruction, Hydronephrosis, Prostate cancer, Benign Prostatic Hyperplasia, Urethral stricture, Urinary incontinence, Bladder overactivity, Elevated PSA, Testicular mass, Renal mass, Renal cancer, Renal cyst, Infertility, Low testosterone, Erectile dysfunction, Elective sterilization" 
  },
  {
    role: "system", 
    content: "Common Enloe Urology in-office procedures with CPT codes include (but are not limited to): Vasectomy (55250), Cystoscopy (52000), Transrectal ultrasound guided prostate biopsy (55700, 76942), Transrectal ultrasound of prostate (76872), Cystoscopy with stent removal (52310, 52315), Spermatic cord nerve block, Peripheral nerve evaluation, Cystoscopy with bladder botox (52247), Percutaneous tibial nerve stimulation, Urocuff (55899)"
  },
  {
    role: "system", 
    content: "Common Enloe Urology surgery procedures with CPT codes (which take place at the Enloe Medical Center) include (but are not limited to): Transurethral resection of bladder tumor (55235, 55240), Transurethral resection of prostate (52601), Transurethral resection of bladder neck (52500), Urolift (55441, 55442), Aquablation (0421T, C00363), Ureteroscopy with basket removal of kidney stones (52352), Ureteroscopy with laser lithotripsy of kidney stones (52356), Ureteroscopy with biopsies of renal pelvic mass and laser ablation of tumor (52354), Robotic radical nephrectomy (50545), Robotic radical nephroureterectomy, Robotic partial nephrectomy (50543), Robotic pyeloplasty (50544), Robotic radical prostatectomy (55867), Mid urethral sling placement, Interstim"
  },
  {
    role: "system",
    content: "Do not answer questions outside of the scope of urology. Do not answer non-medical questions. Do not provide medical advice or diagnosis outside of urology. Do not provide emergency services. Do not provide information about other medical specialties or services."
  },
]


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
    const messagesToSend = [...botContext, ...userMessages];

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

app.post('/submit-feedback', async (req, res) => {
  const { helpful } = req.body; 
  try {
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

app.listen(port, '0.0.0.0', () => {
  console.log(`Server listening on port ${port}`);
});

