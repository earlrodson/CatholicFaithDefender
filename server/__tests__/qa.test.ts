import supertest from 'supertest';
import request from 'supertest';
import express from 'express';
import { describe, it, expect, beforeAll, afterAll, beforeEach } from '@jest/globals';
import dotenv from 'dotenv';
import { resetTestDatabase, closeTestDatabase, db } from '../test-db-config';
import { qaQuestions } from '../../shared/schema';
import { eq } from 'drizzle-orm';

// Create a custom request function that uses the correct protocol and port
const testRequest = (app: express.Express) => {
  return request.agent(app);
};

// Load test environment variables
dotenv.config({ path: '.env.test' });

// Create a test app instance
const app = express();

// Set up middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Add a simple health check endpoint for testing
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Register API routes
import { registerRoutes } from '../routes';

beforeAll(async () => {
  // Set up test database with test data
  try {
    await resetTestDatabase();
  } catch (error) {
    console.error('Failed to set up test database:', error);
    throw error;
  }
  
  // Register routes after migrations
  await registerRoutes(app);
});

afterAll(async () => {
  // Close the database connection after all tests
  await closeTestDatabase();
});

// Simple health check test to verify the test setup
describe('Health Check', () => {
  it('should return 200 and ok status', async () => {
    console.log('Running health check test...');
    try {
      const response = await request(app).get('/health');
      console.log('Response:', response.status, response.body);
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ status: 'ok' });
    } catch (error) {
      console.error('Health check test failed:', error);
      throw error;
    }
  });
});

describe('QA Questions API', () => {
  // Test data
  const testQuestion = {
    question: 'What is the meaning of life?',
    answer: 'The meaning of life is to love God and love others.',
    language: 'english',
    category: 'theology',
    tags: ['philosophy', 'theology']
  };

  beforeEach(async () => {
    // Clear existing data
    await db.delete(qaQuestions);
    
    // Insert test data
    await db.insert(qaQuestions).values([
      {
        question: 'What is faith?',
        answer: 'Belief in God',
        fullAnswer: 'Faith is the assurance of things hoped for, the conviction of things not seen.',
        language: 'english',
        category: 'theology'
      },
      {
        question: '¿Qué es la fe?',
        answer: 'Creer en Dios',
        fullAnswer: 'La fe es la certeza de lo que se espera, la convicción de lo que no se ve.',
        language: 'spanish',
        category: 'teología'
      }
    ]);
  });

  describe('GET /api/qa', () => {
    it('should return an array of questions', async () => {
      // Insert a test question
      const testQuestion = {
        question: 'Test question',
        answer: 'Test answer',
        fullAnswer: 'Test full answer',
        language: 'english',
        category: 'test'
      };
      
      await db.insert(qaQuestions).values(testQuestion);
      
      const response = await testRequest(app)
        .get('/api/qa')
        .expect('Content-Type', /json/);
      
      // Log the response for debugging
      console.log('QA API Response:', {
        status: response.status,
        body: response.body,
        error: response.error,
        text: response.text
      });
      
      // Now check the status code with a more helpful error message
      if (response.status !== 200) {
        console.error('Unexpected status code:', response.status, 'Response body:', response.body);
      }
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0]).toMatchObject({
        question: expect.any(String),
        answer: expect.any(String),
        language: expect.any(String)
      });
    });

    it('should filter questions by language', async () => {
      // Insert test questions in different languages
      await db.insert(qaQuestions).values([
        {
          question: 'English question',
          answer: 'English answer',
          fullAnswer: 'English full answer',
          language: 'english',
          category: 'test'
        },
        {
          question: 'Spanish question',
          answer: 'Spanish answer',
          fullAnswer: 'Spanish full answer',
          language: 'spanish',
          category: 'test'
        }
      ]);

      const response = await testRequest(app)
        .get('/api/qa?lang=spanish')
        .expect('Content-Type', /json/);
      
      // Log the response for debugging
      console.log('QA API Filter Response (Spanish):', {
        status: response.status,
        body: response.body,
        error: response.error,
        text: response.text
      });
      
      // Now check the status code with a more helpful error message
      if (response.status !== 200) {
        console.error('Unexpected status code:', response.status, 'Response body:', response.body);
      }
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      // Verify all returned questions are in Spanish
      response.body.forEach((question: any) => {
        expect(question.language).toBe('spanish');
      });
    });
  });
});
