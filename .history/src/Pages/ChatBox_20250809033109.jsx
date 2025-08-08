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
    <div className="flex flex-col h-screen max-w-lg mx-auto border rounded-lg shadow-lg bg-white">
      {/* Header */}
      <header className="px-6 py-4 bg-gray-100 border-b border-gray-300 rounded-t-lg">
        <h2 className="text-xl font-semibold text-gray-800">Chat with Admin</h2>
      </header>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 italic select-none mt-8">
            No messages yet
          </div>
        ) : (
          messages.map((msg, i) => {
            const isSender = msg.sender_name === 'Admin'; // Adjust as needed
            return (
              <div
                key={msg.id || i}
                className={`max-w-3/4 px-4 py-2 rounded-2xl shadow-sm break-words
                  ${isSender ? 'bg-green-100 self-end text-gray-900' : 'bg-white self-start text-gray-800'}
                `}
                style={{ wordBreak: 'break-word' }}
              >
                <p className="text-sm">{msg.message}</p>
                <div className="text-xs text-gray-500 text-right mt-1 select-none">
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form
        onSubmit={sendMessage}
        className="flex items-center gap-3 px-4 py-3 border-t border-gray-300 bg-gray-100 rounded-b-lg"
      >
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-grow rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 px-4 py-2 text-gray-700"
          autoComplete="off"
        />
        <button
          type="submit"
          disabled={!newMessage.trim()}
          className={`rounded-full px-5 py-2 font-semibold text-white transition-colors
            ${newMessage.trim() ? 'bg-blue-600 hover:bg-blue-700 cursor-pointer' : 'bg-blue-300 cursor-not-allowed'}
          `}
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default Chatbox;
