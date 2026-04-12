const { User } = require('../models');
const bcrypt = require('bcryptjs');

async function createAdmin() {
    try {
        const admin = await User.create({
            email: 'admin@kaziconnect.com',
            password: await bcrypt.hash('admin123', 10),
            role: 'admin',
            isVerified: true
        });
        console.log('Admin created:', admin.email);
    } catch (error) {
        console.log('Admin may already exist');
    }
}

createAdmin();