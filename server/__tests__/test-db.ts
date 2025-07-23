import pg from 'pg';
const { Pool } = pg;
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
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Disable SSL in test environment (if testing locally)
  ssl: false,
  // Set a timeout to avoid hanging tests
  connectionTimeoutMillis: 5000,
});

// Create a Drizzle instance for testing
export const db = drizzle(pool, { schema });

// Helper function to reset the test database
export async function resetTestDatabase() {
  try {
    // Drop all tables to ensure a clean state
    await pool.query('DROP TABLE IF EXISTS questions CASCADE');
    
    // Recreate the test table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS questions (
        id SERIAL PRIMARY KEY,
        question TEXT NOT NULL,
        answer TEXT NOT NULL,
        language VARCHAR(50) DEFAULT 'english',
        category VARCHAR(100),
        tags TEXT[],
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    // Insert test data
    await pool.query(`
      INSERT INTO questions (question, answer, language, category, tags)
      VALUES 
        ('What is faith?', 'Faith is the assurance of things hoped for...', 'english', 'theology', '{"faith", "basics"}'),
        ('¿Qué es la fe?', 'La fe es la certeza de lo que se espera...', 'spanish', 'teología', '{"fe", "básicos"}');
    `);
    
    console.log('Test database reset successfully');
  } catch (error) {
    console.error('Failed to reset test database:', error);
    throw error;
  }
}

// Helper function to close the database connection
export async function closeTestDatabase() {
  await pool.end();
}
