// entry point
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const { sequelize } = require('./models');

const authRoutes = require('./routes/authRoutes');
const jobRoutes = require('./routes/jobRoutes');
const messageRoutes = require('./routes/messageRoutes');

require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// http server and initialization of Socket.io
const ServerInstance = http.createServer(app); // wraps express inside a server
const io = new Server(ServerInstance, {
    cors: {
        origin: "http://localhost:5173", // react URL
        methods: ["GET", "POST"]
    }
});

// socket.io
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // user joins room based on their User ID
    socket.on('join', (userId) => {
        socket.join(userId);
        console.log(`User ${userId} joined their private room`);
    });

    // handle sending messages
    socket.on('send_message', (data) => {
        io.to(data.receiverId).emit('receive_message', data);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/messages', messageRoutes);
app.use('/uploads', express.static('uploads'));
app.use('/api/disputes', require('./routes/disputeRoutes'));
 
const PORT = process.env.PORT || 5000;

sequelize.sync({ alter: true }).then(() => {
    console.log('Database Synced');
    ServerInstance.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});