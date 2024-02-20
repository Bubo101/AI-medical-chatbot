import sqlite3 from 'sqlite3';
import { open } from 'sqlite'; // Use sqlite wrapper to work with async/await

sqlite3.verbose();

const dbPath = 'path/to/your/database.db'; // Update the path as needed

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
