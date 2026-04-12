import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import API from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { 
    Send, 
    MessageSquare, 
    User as UserIcon, 
    MoreVertical, 
    Search, 
    Phone, 
    Video, 
    Paperclip, 
    Smile,
    Check,
    CheckCheck,
    Clock,
    Circle
} from 'lucide-react';
import { io } from 'socket.io-client';

const socket = io("http://localhost:5000");

export default function WorkerMessages() {
    const location = useLocation();
    const { user } = useAuth();
    const messagesEndRef = useRef(null);
    const searchInputRef = useRef(null);

    const incomingContactId = location.state?.contactId;

    const [chats, setChats] = useState([]);
    const [activeChat, setActiveChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [onlineUsers, setOnlineUsers] = useState(new Set());

    const currentSessionLabel = user?.email
        ? `${user.role} - ${user.email}`
        : user?.role
            ? `${user.role} session`
            : 'Unknown session';

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // fetch messages whenever there is new chat
    useEffect(() => {
        const fetchConversations = async () => {
            try {
                const { data } = await API.get('/messages/conversations/list');

                // map the data
                const formatted = data.map(c => ({
                    id: c.id,
                    name: c.role === 'employer' ? c.Employer?.companyName : `${c.Worker?.firstName} ${c.Worker?.lastName}`,
                    avatar: c.role === 'employer' ? c.Employer?.companyName?.[0] : c.Worker?.firstName?.[0] || 'U',
                    lastMessage: c.lastMessage || 'No messages yet',
                    lastMessageTime: c.lastMessageTime || 'Now',
                    unreadCount: c.unreadCount || 0,
                    isOnline: onlineUsers.has(c.id),
                    role: c.role
                }));
                setChats(formatted);
            } catch (err) {
                console.error("Could not fetch conversation list");
            }
        };
        fetchConversations();
    }, [onlineUsers]);

    // logic to handle the "Chat" button
    useEffect(() => {
        if (incomingContactId && chats.length >= 0) {
            const existingChat = chats.find(c => c.id === incomingContactId);
            if (existingChat) {
                setActiveChat(existingChat);
            } else if (incomingContactId) {
                API.get(`contact-info/${incomingContactId}`).then(({ data }) => {
                    const newPerson = { 
                        id: data.id, 
                        name: data.name,
                        avatar: data.name?.[0] || 'U',
                        role: data.role
                    };
                    setChats(prev => [newPerson, ...prev]);
                    setActiveChat(newPerson);
                });
            }
        }
    }, [incomingContactId, chats]);

    // Load messages when active chat changes
    useEffect(() => {
        if (activeChat) {
            const fetchMessages = async () => {
                try {
                    const { data } = await API.get(`/messages/conversation/${activeChat.id}`);
                    setMessages(data || []);
                } catch (err) {
                    console.error("Error loading messages", err);
                    setMessages([]);
                }
            };
            fetchMessages();
        }
    }, [activeChat]);

    // Socket.io setup
    useEffect(() => {
        if (user) {
            socket.emit('join', user.id);
            
            socket.on('receive_message', (data) => {
                if (activeChat && data.senderId === activeChat.id) {
                    setMessages(prev => [...prev, data]);
                } else {
                    // Update chat list to show new message
                    setChats(prev => prev.map(chat => 
                        chat.id === data.senderId 
                            ? { ...chat, lastMessage: data.content, lastMessageTime: 'Now', unreadCount: (chat.unreadCount || 0) + 1 }
                            : chat
                    ));
                }
            });

            socket.on('user_typing', ({ userId, isTyping: typing }) => {
                if (activeChat && userId === activeChat.id) {
                    setIsTyping(typing);
                }
            });

            socket.on('user_online', (userId) => {
                setOnlineUsers(prev => new Set(prev).add(userId));
            });

            socket.on('user_offline', (userId) => {
                setOnlineUsers(prev => {
                    const newSet = new Set(prev);
                    newSet.delete(userId);
                    return newSet;
                });
            });

            return () => {
                socket.off('receive_message');
                socket.off('user_typing');
                socket.off('user_online');
                socket.off('user_offline');
            };
        }
    }, [user, activeChat]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!input.trim() || !activeChat) return;

        const messageData = {
            senderId: user.id,
            receiverId: activeChat.id,
            content: input.trim(),
            timestamp: new Date().toISOString()
        };

        try {
            await API.post('/messages/send', messageData);
            socket.emit('send_message', messageData);
            setMessages(prev => [...prev, { ...messageData, senderId: user.id }]);
            setInput('');
            
            // Update chat list
            setChats(prev => prev.map(chat => 
                chat.id === activeChat.id 
                    ? { ...chat, lastMessage: input.trim(), lastMessageTime: 'Now', unreadCount: 0 }
                    : chat
            ));
        } catch (err) {
            alert("Message failed to send");
            console.error(err);
        }
    };

    const handleTyping = (value) => {
        setInput(value);
        if (activeChat) {
            socket.emit('typing', { receiverId: activeChat.id, isTyping: value.length > 0 });
        }
    };

    const formatTime = (timestamp) => {
        if (!timestamp) return '';
        const date = new Date(timestamp);
        const now = new Date();
        const diffInHours = (now - date) / (1000 * 60 * 60);
        
        if (diffInHours < 1) return 'Just now';
        if (diffInHours < 24) return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        if (diffInHours < 48) return 'Yesterday';
        return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    };

    const filteredChats = chats.filter(chat => 
        chat.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const MessageStatus = ({ message }) => {
        if (message.senderId !== user.id) return null;
        
        const isRead = true; // This would come from backend
        return isRead ? (
            <CheckCheck size={16} className="text-blue-500" />
        ) : (
            <Check size={16} className="text-gray-400" />
        );
    };

    return (
        <div className="flex h-[calc(100vh-160px)] bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-200">
            {/* Sidebar - Conversations List */}
            <div className="w-96 border-r border-gray-200 flex flex-col">
                {/* Sidebar Header */}
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-gray-900">Messages</h2>
                        <div className="flex items-center gap-2">
                            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                <Phone size={18} className="text-gray-600" />
                            </button>
                            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                <Video size={18} className="text-gray-600" />
                            </button>
                            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                <MoreVertical size={18} className="text-gray-600" />
                            </button>
                        </div>
                    </div>
                    
                    {/* Search Bar */}
                    <div className="relative">
                        <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            ref={searchInputRef}
                            type="text"
                            placeholder="Search conversations..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-gray-100 rounded-xl outline-none text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                        />
                    </div>
                </div>

                {/* Conversations List */}
                <div className="flex-1 overflow-y-auto">
                    {filteredChats.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-32 text-gray-500">
                            <MessageSquare size={48} className="mb-2 text-gray-300" />
                            <p className="text-sm">No conversations found</p>
                        </div>
                    ) : (
                        filteredChats.map((chat) => (
                            <div
                                key={chat.id}
                                onClick={() => setActiveChat(chat)}
                                className={`group relative p-4 cursor-pointer transition-all border-b border-gray-100 ${
                                    activeChat?.id === chat.id 
                                        ? 'bg-blue-50 border-l-4 border-l-blue-600' 
                                        : 'hover:bg-gray-50'
                                }`}
                            >
                                <div className="flex items-start gap-3">
                                    {/* Avatar */}
                                    <div className="relative">
                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white ${
                                            chat.isOnline ? 'bg-green-500' : 'bg-gray-400'
                                        }`}>
                                            {chat.avatar}
                                        </div>
                                        {chat.isOnline && (
                                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></div>
                                        )}
                                    </div>
                                    
                                    {/* Chat Info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-1">
                                            <h4 className="font-semibold text-gray-900 truncate">{chat.name}</h4>
                                            <span className="text-xs text-gray-500">{formatTime(chat.lastMessageTime)}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <p className="text-sm text-gray-600 truncate">{chat.lastMessage}</p>
                                            {chat.unreadCount > 0 && (
                                                <span className="bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                                    {chat.unreadCount}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Main Chat Window */}
            <div className="flex-1 flex flex-col bg-gray-50">
                {activeChat ? (
                    <>
                        {/* Chat Header */}
                        <div className="p-4 bg-white border-b border-gray-200 shadow-sm">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
                                        activeChat.isOnline ? 'bg-green-500' : 'bg-gray-400'
                                    }`}>
                                        {activeChat.avatar}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900">{activeChat.name}</h3>
                                        <p className="text-xs text-gray-500">
                                            {activeChat.isOnline ? 'Active now' : 'Offline'}
                                        </p>
                                    </div>
                                </div>
                                <div className="hidden md:flex items-center mr-3 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium">
                                    Signed in as {currentSessionLabel}
                                </div>
                                <div className="flex items-center gap-2">
                                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                        <Phone size={18} className="text-gray-600" />
                                    </button>
                                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                        <Video size={18} className="text-gray-600" />
                                    </button>
                                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                        <MoreVertical size={18} className="text-gray-600" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 p-6 overflow-y-auto space-y-4">
                            {messages.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                                    <MessageSquare size={64} className="mb-4 text-gray-300" />
                                    <p className="font-medium">Start a conversation</p>
                                    <p className="text-sm">Send a message to begin chatting</p>
                                </div>
                            ) : (
                                messages.map((msg, index) => {
                                    const isOwnMessage = msg.senderId === user.id;
                                    return (
                                    <div key={index} className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[70%] group relative`}>
                                            <div className={`px-4 py-3 rounded-2xl shadow-sm ${
                                                isOwnMessage 
                                                    ? 'bg-blue-600 text-white rounded-tr-none' 
                                                    : 'bg-white text-gray-800 rounded-tl-none border border-gray-200'
                                            }`}>
                                                <p className="text-sm">{msg.content}</p>
                                            </div>
                                            <div className={`flex items-center gap-2 mt-1 text-xs ${
                                                isOwnMessage ? 'justify-end' : 'justify-start'
                                            }`}>
                                                <span className="text-gray-500">{formatTime(msg.timestamp)}</span>
                                                <MessageStatus message={msg} />
                                            </div>
                                        </div>
                                    </div>
                                    );
                                })
                            )}
                            
                            {/* Typing Indicator */}
                            {isTyping && (
                                <div className="flex items-center gap-2 text-gray-500 text-sm">
                                    <div className="flex gap-1">
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                    </div>
                                    <span>typing...</span>
                                </div>
                            )}
                            
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Message Input */}
                        <div className="p-4 bg-white border-t border-gray-200">
                            <form onSubmit={handleSendMessage} className="flex items-end gap-3">
                                <button type="button" className="p-3 text-gray-500 hover:text-gray-700 transition-colors">
                                    <Paperclip size={20} />
                                </button>
                                <div className="flex-1 relative">
                                    <input
                                        value={input}
                                        onChange={(e) => handleTyping(e.target.value)}
                                        placeholder="Type a message..."
                                        className="w-full px-4 py-3 bg-gray-100 rounded-xl outline-none text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all resize-none"
                                    />
                                </div>
                                <button type="button" className="p-3 text-gray-500 hover:text-gray-700 transition-colors">
                                    <Smile size={20} />
                                </button>
                                <button 
                                    type="submit" 
                                    disabled={!input.trim()}
                                    className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                >
                                    <Send size={20} />
                                </button>
                            </form>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center text-gray-500 flex-col gap-4">
                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center">
                            <MessageSquare size={48} className="text-gray-300" />
                        </div>
                        <div className="text-center">
                            <h3 className="font-semibold text-lg mb-2">Welcome to Messages</h3>
                            <p className="text-sm">Select a conversation to start chatting</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
