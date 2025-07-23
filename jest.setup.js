// Import environment variables for testing
import dotenv from 'dotenv';

// Load environment variables from .env.test file
dotenv.config({ path: '.env.test' });

// Set any global test configurations here
process.env.NODE_ENV = 'test';
