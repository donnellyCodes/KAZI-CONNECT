// Test setup file
const { sequelize } = require('../config/db');

beforeAll(async () => {
  // Test database setup
  if (process.env.NODE_ENV !== 'test') {
    process.env.NODE_ENV = 'test';
  }
  
  // Sync database for testing
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  // Close database connection
  await sequelize.close();
});

beforeEach(async () => {
  // Clean up database before each test
  await sequelize.truncate({ cascade: true });
});
