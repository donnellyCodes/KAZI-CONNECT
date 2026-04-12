const request = require('supertest');
const app = require('../server');
const { User } = require('../models');

describe('Authentication Endpoints', () => {
  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123',
        role: 'worker',
        profileData: {
          firstName: 'John',
          lastName: 'Doe'
        }
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      expect(response.body).toHaveProperty('token');
      expect(response.body.user).toHaveProperty('email', userData.email);
      expect(response.body.user).toHaveProperty('role', userData.role);
    });

    it('should return validation error for invalid email', async () => {
      const userData = {
        email: 'invalid-email',
        password: 'password123',
        role: 'worker',
        profileData: {
          firstName: 'John',
          lastName: 'Doe'
        }
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body).toHaveProperty('message', 'Validation failed');
    });

    it('should return error for duplicate email', async () => {
      const userData = {
        email: 'duplicate@example.com',
        password: 'password123',
        role: 'worker',
        profileData: {
          firstName: 'Jane',
          lastName: 'Doe'
        }
      };

      // Create first user
      await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      // Try to create duplicate
      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(409);

      expect(response.body).toHaveProperty('message', 'Duplicate entry');
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      // Create a test user for login tests
      const userData = {
        email: 'login@example.com',
        password: 'password123',
        role: 'worker',
        profileData: {
          firstName: 'Test',
          lastName: 'User'
        }
      };

      await request(app)
        .post('/api/auth/register')
        .send(userData);
    });

    it('should login with valid credentials', async () => {
      const loginData = {
        email: 'login@example.com',
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(200);

      expect(response.body).toHaveProperty('token');
      expect(response.body.user).toHaveProperty('email', loginData.email);
    });

    it('should return error for invalid credentials', async () => {
      const loginData = {
        email: 'login@example.com',
        password: 'wrongpassword'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(401);

      expect(response.body).toHaveProperty('message', 'Invalid email or password');
    });

    it('should return error for non-existent user', async () => {
      const loginData = {
        email: 'nonexistent@example.com',
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(401);

      expect(response.body).toHaveProperty('message', 'Invalid email or password');
    });
  });

  describe('POST /api/auth/verify-otp', () => {
    let testUser;

    beforeEach(async () => {
      // Create a user with OTP
      const userData = {
        email: 'otp@example.com',
        password: 'password123',
        role: 'worker',
        profileData: {
          firstName: 'OTP',
          lastName: 'User'
        }
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData);

      testUser = response.body.user;
    });

    it('should verify OTP successfully', async () => {
      // Get the OTP from the user record (in real app, this would be sent via email)
      const user = await User.findOne({ where: { email: 'otp@example.com' } });
      
      const otpData = {
        email: 'otp@example.com',
        otp: user.otpCode
      };

      const response = await request(app)
        .post('/api/auth/verify-otp')
        .send(otpData)
        .expect(200);

      expect(response.body).toHaveProperty('message', 'Account verified successfully!');
    });

    it('should return error for invalid OTP', async () => {
      const otpData = {
        email: 'otp@example.com',
        otp: '123456'
      };

      const response = await request(app)
        .post('/api/auth/verify-otp')
        .send(otpData)
        .expect(400);

      expect(response.body).toHaveProperty('message', 'Invalid or expired OTP');
    });
  });
});
