// contains the logic to save a message and retrieve the conversation history between two users

const { Message, User, Worker, Employer } = require('../models');
const { Op } = require('sequelize');

//@desc Get conversation history between users
// @route GET /api/messages/:otherUserId

exports.getMessages = async (req, res) => {
    try {
        const { otherUserId } = req.params;
        const currentUserId = req.user.id;

        if (!otherUserId) return res.status(400).json({ message: "User ID missing" });

        const messages = await Message.findAll({
            where: {
                [Op.or]: [
                    { senderId: currentUserId, receiverId: otherUserId },
                    { senderId: otherUserId, receiverId: currentUserId }
                ]
            },
            order: [['createdAt', 'ASC']]
        });
        res.json(messages);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


//@desc send a message
// @route POST /api/messages

exports.sendMessage = async (req, res) => {
    try {
        const { receiverId, content } = req.body;
        const senderId = req.user.id;

        if (!receiverId || !content) {
            return res.status(400).json({ message: "Receiver ID and content are required" });
        }

        const message = await Message.create({
            senderId,
            receiverId,
            content
        });
        res.status(201).json(message);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// @desc Get list of users I have chatted with (Chat List)
// @route GET /api/messages/conversations/list
exports.getConversations = async (req, res) => {
    try {
        const userId = req.user.id;

        // find all unique user IDs the current user has messaged or received message from
        const messages = await Message.findAll({
            where: {
                [Op.or]: [{ senderId: userId }, { receiverId: userId }]
            },
            attributes: ['senderId', 'receiverId'],
            order: [['createdAt', 'DESC']]
        });

        // extract unique IDs
        const chatPartnerIds = [...new Set(messages.flatMap(m => [m.senderId, m.receiverId]))].filter(id => id !== userId);

        // fetch user details for those IDs
        const chatPartners = await User.findAll({
            where: { id: chatPartnerIds },
            attributes: ['id', 'email', 'role'],
            include: [
                { model: Worker, attributes: ['firstName', 'lastName'] },
                { model: Employer, attributes: ['companyName'] }
            ]
        });

        res.json(chatPartners);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};