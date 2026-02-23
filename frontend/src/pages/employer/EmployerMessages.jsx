import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import API from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { io } from 'socket.io-client';

import { Send, User, Search, MoreVertical, MessageSquare } from 'lucide-react';

const socket = io('http://localhost:5000');

export default function EmployerMessages() {
    const location = useLocation();
    const { user } = useAuth();

    const incomingContactId = location.state?.contactId;

    const [chats, setChats] = useState([]);
    const [activeChat, setActiveChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loadingChats, setLoadingChats] = useState(true);

    // 2. Load conversations
    useEffect(() => {
        const fetchConversations = async () => {
            try {
                const { data } = await API.get('/messages/conversations/list');
                const formatted = data.map(c => ({
                    id: c.id,
                    name: c.role === 'worker' ? `${c.Worker?.firstName} ${c.Worker?.lastName}` : c.Employer?.companyName
                }));
                setChats(formatted);
                setLoadingChats(false);
            } catch (err) { console.error("Error loading charts", err); }
        };
        fetchConversations();
    }, []);

    // auto select logic
    useEffect(() => {
        if (incomingContactId &&!loadingChats) {
            console.log("Checking for incoming contact in sidebar:", incomingContactId);

            const existingChat = chats.find(c => c.id === incomingContactId);
            if (existingChat) {
                console.log("Contact found in existing chats, opening window...");
                setActiveChat(existingChat);
            } else {
                console.log("Contact NOT in sidebar. Fetching new contact info...");
                API.get(`/jobs/contact-info/${incomingContactId}`).then(({ data }) => { // /api/jobs/contact-info
                    const newPerson = { id: data.id, name: data.name };
                    setChats(prev => [newPerson, ...prev]);
                    setActiveChat(newPerson);
                }).catch(err => console.error("Contact fetch error", err));
            }
        }
    }, [incomingContactId, loadingChats]);

    // socket.io setup
    useEffect(() => {
        if (user?.id) {
            socket.emit('join', user.id);
        }
        socket.on('receive_message', (data) => {
            if (activeChat && data.senderId === activeChat.id) {
                setMessages((prev) => [...prev, data]);
            }
        });
        return () => socket.off('receive_message');
    }, [user, activeChat]);

    // fetch message for specific chat
    useEffect(() => {
        if (activeChat && activeChat.id) {
            console.log("Fetching messages for:", activeChat.id);
            const fetchMessages = async () => {
                try {
                    const { data } = await API.get(`/messages/${activeChat.id}`);
                    setMessages(data);
                } catch (err) {
                    console.error("Could not fetch messages");
                }
            };
            fetchMessages();

            // Auto-refresh every 5 seconds
            const timer = setInterval(fetchMessages, 5000);
            return () => clearInterval(timer);
        }
    }, [activeChat]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!input.trim() || !activeChat) return;

        try {
            const { data } = await API.post('/messages', {
                receiverId: activeChat.id,
                content: input
            });
            // emit via socket
            socket.emit('send_message', data);
            setMessages([...messages, data]); // adds message to UI
            setInput(''); // CLEARS the text box
        } catch (err) {
            alert("Message failed to send");
            console.error(err);
        }
    };
    

    return (
        <div className="flex h-[calc(100vh-160px)] bg-white rounded-2xl shadow-sm overflow-hidden border border-slate-200">
            {/*Sidebar - List of people */}
            <div className="w-80 border-r border-slate-200 flex flex-col">
                <div className="p-4 border-b font-bold text-slate-700 uppercase tracking-wider text-xs">Conversations</div>
                <div className="flex-1 overflow-y-auto">
                    {chats.map((chat) => (
                        <div
                            key={chat.id}
                            onClick={() => setActiveChat(chat)} // selects the whole chat object
                            className={`p-4 flex gap-3 cursor-pointer transition-all ${activeChat?.id === chat.id ? 'bg-indigo-50 border-r-4 border-indigo-600' : 'hover:bg-slate-50'}`}
                        >
                            <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center text-slate-500 font-bold">
                                {chat.name}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="font-bold text-slate-800 truncate">{chat.name}</h4>
                                <p className="text-xs text-slate-500 truncate">{chat.lastMsg}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Main chat window */}
            <div className="flex-1 flex flex-col bg-slate-50">
                {activeChat ? (
                    <>
                        {/* Header */}
                        <div className="p-4 border-b bg-white flex justify-between items-center shadow-sm">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold">
                                    {activeChat.name}
                                </div>
                                <h3 className="font-bold text-slate-800">{activeChat.name}</h3>
                            </div>
                        </div>
                        {/* Message Display */}
                        <div className="flex-1 p-6 overflow-y-auto space-y-4">
                            {messages.map((msg, index) => (
                                <div key={index} className={`flex ${msg.senderId === activeChat.id ? 'justify-start' : 'justify-end'}`}>
                                    <div className={`max-w-[70%] p-3 rounded-2xl shadow-sm text-sm ${msg.senderId === activeChat.Id ? 'bg-white text-slate-700 rounded-tl-none' : 'bg-indigo-600 text-white rounded-tr-none'}`}>
                                        {msg.content}
                                    </div>
                                </div>
                            ))}
                        </div>
                        {/* Form */}
                        <div className="p-4 bg-white border-t">
                            <form onSubmit={handleSendMessage} className="flex gap-2">
                                <input
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Write a message..."
                                    className="flex-1 p-3 bg-slate-100 rounded-xl outline-none text-sm focus:ring-2 focus:ring-indigo-500"
                                />
                                <button type="submit" className="bg-indigo-600 text-white p-3 rounded-xl hover:bg-indigo-700">
                                    <Send size={20} />
                                </button>
                            </form>
                        </div>
                    </>
                 ) : (
                    <div className="flex-1 flex items-center justify-center text-slate-400 flex-col gap-2">
                        <MessageSquare size={48} />
                        <p className="font-medium">Select a contact to start chatting</p>
                    </div>
                )}
            </div>
        </div>
    );
}