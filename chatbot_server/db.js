import sqlite3 from 'sqlite3';
import { open } from 'sqlite'; // Use sqlite wrapper to work with async/await

sqlite3.verbose();

const dbPath = './database.db'; // Update the path as needed

export async function openDb() {
  return open({
    filename: dbPath,
    driver: sqlite3.Database
  });
}

export async function setupDb() {
  const db = await openDb();
  await db.exec(`CREATE TABLE IF NOT EXISTS feedback (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    helpful BOOLEAN NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);
  console.log('Feedback table is created or already exists.');
}

export async function insertFeedback(helpful) {
  const db = await openDb();
  const sql = `INSERT INTO feedback (helpful) VALUES (?)`;
  try {
    const result = await db.run(sql, [helpful]);
    console.log(`Feedback inserted with ID: ${result.lastID}`);
    return result.lastID; // Optionally return the ID of the inserted feedback
  } catch (error) {
    console.error('Error inserting feedback:', error.message);
    throw error; // Re-throw the error to handle it in the calling context
  }
}

export async function setupSessionDb() {
  const db = await openDb();
  await db.exec(`CREATE TABLE IF NOT EXISTS sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    feedback_given BOOLEAN DEFAULT 0
  )`);
  console.log('Sessions table is created or already exists.');
}

// Function to insert a new session record
export async function insertSession() {
  const db = await openDb();
  await db.run(`INSERT INTO sessions (feedback_given) VALUES (0)`);
  
  const { total } = await db.get(`SELECT COUNT(*) as total FROM sessions`);
  
  console.log(`Total sessions: ${total}`);
}

// Function to update a session with feedback given
export async function updateSessionFeedback(sessionId) {
  const db = await openDb();
  await db.run(`UPDATE sessions SET feedback_given = 1 WHERE id = ?`, [sessionId]);
  console.log('Session feedback updated.');
}
