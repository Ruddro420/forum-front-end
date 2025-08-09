import React, { useState, useEffect, useRef, useMemo } from 'react';
import axios from 'axios';
import * as Ably from 'ably';
import { useAuth } from '../Auth/context/AuthContext'; // your auth context
import { Send } from 'lucide-react';

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
    <div className="max-w-lg mx-auto bg-white rounded-xl border border-gray-200 shadow-md overflow-hidden">

      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-purple-600 text-white flex items-center gap-3">
        <img
          src="/admin-avatar.jpg"
          alt="Admin"
          className="w-10 h-10 rounded-full object-cover border border-white"
        />
        <div>
          <h2 className="font-semibold text-lg">Admin</h2>
          <p className="text-xs opacity-80">Online now</p>
        </div>
      </div>

      {/* Messages */}
      <div className="h-80 overflow-y-auto p-4 bg-gray-50 space-y-4">
        {messages.length === 0 ? (
          <div className="text-gray-500 text-center mt-10">No messages yet</div>
        ) : (
          messages.map((msg, i) => {
            const isMe = msg.sender_name === "You";
            return (
              <div
                key={msg.id || i}
                className={`flex items-end gap-2 ${isMe ? "justify-end" : "justify-start"}`}
              >
                {/* Admin avatar */}
                {!isMe && (
                  <img
                    src="/admin-avatar.jpg"
                    alt="Admin"
                    className="w-8 h-8 rounded-full object-cover border border-gray-200"
                  />
                )}

                {/* Message bubble */}
                <div
                  className={`max-w-xs lg:max-w-sm px-4 py-2 rounded-2xl shadow-sm ${isMe
                      ? "bg-blue-600 text-white rounded-br-none"
                      : "bg-white text-gray-900 rounded-bl-none border"
                    }`}
                >
                  <p className="text-sm">{msg.message}</p>
                  <span
                    className={`text-[10px] opacity-70 mt-1 block ${isMe ? "text-right" : "text-left"
                      }`}
                  >
                    {new Date(msg.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>

                {/* My avatar */}
                {isMe && (
                  <img
                    src="/user-avatar.jpg"
                    alt="You"
                    className="w-8 h-8 rounded-full object-cover border border-gray-200"
                  />
                )}
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={sendMessage}
        className="p-3 border-t border-gray-200 bg-white flex items-center gap-2"
      >
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={!newMessage.trim()}
          className="bg-blue-600 p-2 rounded-full text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
};

export default Chatbox;
