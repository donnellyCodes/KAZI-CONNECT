const { sequelize } = require('../config/db');

async function resetDatabase() {
    try {
        console.log('Resetting database...');
        
        // Force sync will drop and recreate all tables
        await sequelize.sync({ force: true });
        
        console.log('Database reset successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error resetting database:', error);
        process.exit(1);
    }
}

resetDatabase();
