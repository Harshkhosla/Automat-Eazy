const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server'); // Import your express app

jest.setTimeout(30000); // Increase the timeout if necessary

describe('Auth Controller', () => {
  beforeAll(async () => {
    // Set the JWT_SECRET environment variable for testing
    process.env.JWT_SECRET = 'your_test_secret_key';

    // Connect to the test database
    await mongoose.disconnect();
    await mongoose.connect('mongodb+srv://harsh:Harsh9945khosla@cluster0.osfevs6.mongodb.net/test1', {
      useNewUrlParser: true,
    });
  });

  beforeEach(async () => {
    // Clear the users collection before each test
    await mongoose.connection.collection('users').deleteMany({});
  });

  afterAll(async () => {
    // Close the database connection after tests
    await mongoose.connection.close();
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user and return a token', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'testuser@example.com',
          password: 'password123',
        });

      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('token');
    });

    it('should not register a user with an existing email', async () => {
      await request(app)
        .post('/api/auth/register')
        .send({
          email: 'testuser@example.com',
          password: 'password123',
        });

      const res = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'testuser@example.com',
          password: 'password123',
        });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('message', 'User already exists');
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login an existing user and return a token', async () => {
      // First, register a user
      await request(app)
        .post('/api/auth/register')
        .send({
          email: 'testuser@example.com',
          password: 'password123',
        });

      // Then, try to login
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'testuser@example.com',
          password: 'password123',
        });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('token');
    });

    it('should not login with invalid credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'testuser@example.com',
          password: 'wrongpassword',
        });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('message', 'Invalid credentials');
    });
  });
});
