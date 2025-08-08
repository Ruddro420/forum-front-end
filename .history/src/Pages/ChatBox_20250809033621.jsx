import React, { useState, useEffect, useRef, useMemo } from 'react';
import axios from 'axios';
import * as Ably from 'ably';
import { useAuth } from '../Auth/context/AuthContext'; // your auth context

const API_URL = 'http://192.168.1.104:8000/api';

const adminUser = { id: 1, name: 'Admin' };

const Chatbox = () => {
  const { user } = useAuth();

  const currentUser = useMemo(() => {
    if (!user) return null;
    return {
      id: user.id,
      name: `${user.first_name} ${user.last_name}`,
    };
  }, [user]);

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const ablyClientRef = useRef(null);
  const channelRef = useRef(null);

  useEffect(() => {
    if (!currentUser) return;

    if (ablyClientRef.current) {
      ablyClientRef.current.close();
    }

    const client = new Ably.Realtime({
      authCallback: async (tokenParams, callback) => {
        try {
          const res = await axios.post(`${API_URL}/ably/auth`, { user_id: currentUser.id });
          callback(null, res.data);
        } catch (err) {
          callback(err, null);
        }
      },
    });

    ablyClientRef.current = client;

    return () => {
      client.close();
      ablyClientRef.current = null;
    };
  }, [currentUser]);

  // Load chat history on currentUser change
  useEffect(() => {
    if (!currentUser) return;

    const loadMessages = async () => {
      try {
        const res = await axios.get(`${API_URL}/chat/messages/${adminUser.id}`, {
          params: { current_user_id: currentUser.id },
        });

        const formatted = (res.data || []).map((msg) => ({
          ...msg,
          sender_name: msg.sender_name || 'Unknown',
          timestamp: msg.timestamp || msg.created_at || new Date().toISOString(),
        }));

        setMessages(formatted);
      } catch (err) {
        console.error('Load messages error:', err);
        setError('Failed to load messages');
      }
    };

    loadMessages();
  }, [currentUser]);

  // Subscribe to Ably for real-time messages
  useEffect(() => {
    if (!currentUser || !ablyClientRef.current) return;

    const client = ablyClientRef.current;

    if (channelRef.current) {
      channelRef.current.unsubscribe();
      channelRef.current = null;
    }

    const subscribe = () => {
      const channel = client.channels.get(`chat:user_${currentUser.id}`);

      channel.subscribe('message', (msg) => {
        setMessages((prev) => {
          const exists = prev.some(
            (m) =>
              m.id === msg.data.id ||
              (m.timestamp === msg.data.timestamp && m.message === msg.data.message)
          );
          if (exists) return prev;
          return [...prev, { ...msg.data, sender_name: msg.data.sender_name || 'Unknown' }];
        });
      });

      channelRef.current = channel;
    };

    if (client.connection.state === 'connected') {
      subscribe();
    } else {
      client.connection.once('connected', subscribe);
    }

    return () => {
      if (channelRef.current) {
        channelRef.current.unsubscribe();
        channelRef.current = null;
      }
    };
  }, [currentUser]);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Send message + reload history immediately
  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentUser) return;

    try {
      await axios.post(`${API_URL}/chat/send`, {
        message: newMessage.trim(),
        receiver_id: adminUser.id,
        sender_id: currentUser.id,
      });

      setNewMessage('');

      // Reload history here
      const res = await axios.get(`${API_URL}/chat/messages/${adminUser.id}`, {
        params: { current_user_id: currentUser.id },
      });

      const formatted = (res.data || []).map((msg) => ({
        ...msg,
        sender_name: msg.sender_name || 'Unknown',
        timestamp: msg.timestamp || msg.created_at || new Date().toISOString(),
      }));

      setMessages(formatted);
    } catch (err) {
      console.error('Send message error:', err);
      setError('Failed to send message');
    }
  };

  if (!currentUser) return <div>Please log in to chat</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
   <div className="flex flex-col h-screen mx-w-full bg-gray-100">
      {/* Header */}
      <header className="flex items-center px-6 py-4 bg-white shadow border-b border-gray-300">
        <img
          src={adminUser.avatar || 'https://randomuser.me/api/portraits/men/11.jpg'}
          alt="Admin Avatar"
          className="w-10 h-10 rounded-full mr-4 object-cover"
        />
        <h2 className="text-xl font-semibold text-gray-800">Chat with Admin</h2>
      </header>

      {/* Messages container */}
      <div
        className="flex-1 overflow-y-auto p-6 space-y-4 flex flex-col"
        style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/diamond-upholstery.png")' }}
      >
        {messages.length === 0 && (
          <div className="text-center text-gray-400 italic mt-10 select-none">No messages yet</div>
        )}

        {messages.map((msg, i) => {
          const isCurrentUser = msg.sender_id === currentUser.id;
          const senderAvatar = isCurrentUser
            ? currentUser.avatar || 'https://randomuser.me/api/portraits/women/68.jpg'
            : adminUser.avatar || 'https://randomuser.me/api/portraits/men/11.jpg';

          return (
            <div
              key={msg.id || i}
              className={`flex items-end space-x-3 max-w-3/4 ${
                isCurrentUser ? 'self-end flex-row-reverse space-x-reverse' : 'self-start'
              }`}
            >
              {/* Avatar */}
              <img
                src={senderAvatar}
                alt={`${msg.sender_name} avatar`}
                className="w-10 h-10 rounded-full object-cover shadow-md"
              />

              {/* Message bubble */}
              <div
                className={`px-4 py-2 rounded-2xl shadow-md break-words
                  ${isCurrentUser ? 'bg-blue-600 text-white' : 'bg-white text-gray-900'}
                `}
              >
                <p className="text-sm leading-relaxed">{msg.message}</p>
                <div className="text-xs mt-1 text-gray-200 text-right select-none">
                  {new Date(msg.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
              </div>
            </div>
          );
        })}

        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <form
        onSubmit={sendMessage}
        className="flex items-center gap-3 p-4 bg-white border-t border-gray-300"
      >
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-grow rounded-full border border-gray-300 px-4 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          autoComplete="off"
        />
        <button
          type="submit"
          disabled={!newMessage.trim()}
          className={`p-2 rounded-full transition-colors ${
            newMessage.trim() ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-300 cursor-not-allowed'
          }`}
          aria-label="Send message"
        >
          {/* <PaperPlane className="w-6 h-6 rotate-90" /> */}
        </button>
      </form>
    </div>
  );
};

export default Chatbox;
