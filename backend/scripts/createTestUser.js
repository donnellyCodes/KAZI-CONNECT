const { User, Worker } = require('../models');
const bcrypt = require('bcryptjs');

async function createTestUser() {
    try {
        // Create a verified user directly
        const hashedPassword = await bcrypt.hash('password123', 10);
        
        const user = await User.create({
            email: 'verified@example.com',
            password: hashedPassword,
            role: 'worker',
            isVerified: true
        });
        
        // Create worker profile
        await Worker.create({
            userId: user.id,
            firstName: 'Test',
            lastName: 'User',
            location: 'Nairobi',
            skills: 'JavaScript,React,Node.js',
            availability: true,
            isVerified: true
        });
        
        console.log('Test user created successfully!');
        console.log('Email: verified@example.com');
        console.log('Password: password123');
        process.exit(0);
    } catch (error) {
        console.error('Error creating test user:', error);
        process.exit(1);
    }
}

createTestUser();
