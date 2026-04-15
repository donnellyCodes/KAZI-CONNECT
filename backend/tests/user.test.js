const request = require('supertest');
const app = require('../server');

describe('User Tests', () => {

  const testUser = {
    name: 'Jane Doe',
    email: 'jane@test.com',
    password: '123456'
  };

  // Test registration success
  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/users/register')
      .send(testUser);

    expect(res.statusCode).toBe(201);
    expect(res.body.email).toBe(testUser.email);
  });

  // Test missing fields
  it('should fail if required fields are missing', async () => {
    const res = await request(app)
      .post('/api/users/register')
      .send({
        email: 'missing@test.com'
      });

    expect(res.statusCode).toBe(400);
  });

  // Test duplicate user
  it('should not allow duplicate email', async () => {
    // First registration
    await request(app)
      .post('/api/users/register')
      .send(testUser);

    // Second attempt
    const res = await request(app)
      .post('/api/users/register')
      .send(testUser);

    expect(res.statusCode).toBe(400);
  });

});