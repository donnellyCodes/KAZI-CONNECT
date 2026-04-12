// entry point
const express = require('express');
require('dotenv').config();
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const { sequelize } = require('./models');

const authRoutes = require('./routes/authRoutes');
const jobRoutes = require('./routes/jobRoutes');
const messageRoutes = require('./routes/messageRoutes');

const app = express();

// CORS configuration
const corsOptions = {
    origin: process.env.NODE_ENV === 'production' 
        ? process.env.FRONTEND_URL || 'http://localhost:5173'
        : ['http://localhost:5173', 'http://localhost:5174'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());

// Monitoring middleware
const { monitoring, healthCheck } = require('./middleware/monitoring');
app.use(monitoring);

// Health check endpoint
app.get('/health', healthCheck);

// Simple test endpoint
app.get('/test', (req, res) => {
    res.json({ 
        message: 'Server is running!',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
    });
});

// http server and initialization of Socket.io
const ServerInstance = http.createServer(app); // wraps express inside a server
const io = new Server(ServerInstance, {
    cors: {
        origin: process.env.NODE_ENV === 'production' 
            ? process.env.FRONTEND_URL || 'http://localhost:5173'
            : ['http://localhost:5173', 'http://localhost:5174'],
        methods: ["GET", "POST"],
        credentials: true
    }
});

// Track online users
const onlineUsers = new Map();

// Socket.io connection handling
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // User joins with their user ID
    socket.on('join', (userId) => {
        socket.userId = userId;
        onlineUsers.set(userId, socket.id);
        socket.join(userId);
        console.log(`User ${userId} joined their private room`);
        
        // Notify others that user is online
        socket.broadcast.emit('user_online', userId);
    });

    // Handle typing indicator
    socket.on('typing', ({ receiverId, isTyping }) => {
        socket.to(receiverId).emit('user_typing', { 
            userId: socket.userId, 
            isTyping 
        });
    });

    // Handle sending messages
    socket.on('send_message', async (data) => {
        const { receiverId, content, senderId, timestamp } = data;
        
        // Broadcast to receiver's room
        socket.to(receiverId).emit('receive_message', {
            senderId,
            receiverId,
            content,
            timestamp: timestamp || new Date().toISOString()
        });
        
        console.log(`Message from ${senderId} to ${receiverId}: ${content}`);
    });

    // Handle disconnect
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
        if (socket.userId) {
            onlineUsers.delete(socket.userId);
            // Notify others that user is offline
            socket.broadcast.emit('user_offline', socket.userId);
        }
    });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/messages', messageRoutes);
app.use('/api/payments', require('./routes/paymentRoutes'));
app.use('/api/reviews', require('./routes/reviewRoutes'));
app.use('/uploads', express.static('uploads'));
app.use('/api/disputes', require('./routes/disputeRoutes'));

// Error handling middleware
const { errorHandler, notFound } = require('./middleware/errorHandler');
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Start server first, then sync database
ServerInstance.listen(PORT, async () => {
    console.log(`Server running on port ${PORT}`);
    
    try {
        // Sync database with alter true to update schema without losing data
        await sequelize.sync({ alter: true });
        console.log('Database Synced');
    } catch (error) {
        console.error('Database sync failed:', error);
    }
});
