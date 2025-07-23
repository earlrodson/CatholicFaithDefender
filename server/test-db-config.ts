import pg from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from '@shared/schema';
import dotenv from 'dotenv';

// Load test environment variables
dotenv.config({ path: '.env.test' });

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set in .env.test. Did you forget to create the test database?",
  );
}

// Create a connection pool for testing
export const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  // Disable SSL in test environment (if testing locally)
  ssl: false,
  // Set a timeout to avoid hanging tests
  connectionTimeoutMillis: 5000,
});

// Create a Drizzle instance for testing with snake_case column mapping
export const db = drizzle(pool, { 
  schema,
  // Map camelCase to snake_case for column names
  logger: true
});

// Export the storage instance that uses this db
export { storage } from './storage';

// Helper function to reset the test database
export async function resetTestDatabase() {
  try {
    // Drop all tables to ensure a clean state
    await pool.query('DROP TABLE IF EXISTS questions CASCADE');
    
    // Recreate the test table with all required columns using snake_case to match Drizzle's expectations
    await pool.query(`
      CREATE TABLE IF NOT EXISTS questions (
        id SERIAL PRIMARY KEY,
        question TEXT NOT NULL,
        answer TEXT NOT NULL,
        full_answer TEXT,
        language VARCHAR(50) DEFAULT 'english',
        category VARCHAR(100),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    // Insert test data with snake_case column names
    await pool.query(`
      INSERT INTO questions (question, answer, full_answer, language, category)
      VALUES 
        ('What is faith?', 'Belief in God', 'Faith is the assurance of things hoped for, the conviction of things not seen.', 'english', 'theology'),
        ('¿Qué es la fe?', 'Creer en Dios', 'La fe es la certeza de lo que se espera, la convicción de lo que no se ve.', 'spanish', 'teología');
    `);
    
    console.log('Test database reset successfully');
  } catch (error) {
    console.error('Error resetting test database:', error);
    throw error;
  }
}

// Helper function to close the database connection
export async function closeTestDatabase() {
  await pool.end();
}
