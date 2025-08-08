import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import * as Ably from 'ably';
import { useAuth } from '../Auth/context/AuthContext';

const API_URL = 'http://192.168.1.104:8000/api';
const adminUser = { id: 1, name: 'Admin', is_admin: true };

const Chatbox = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [ablyClient, setAblyClient] = useState(null);
  const channelRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Initialize Ably client
  useEffect(() => {
    if (!user) return;

    const client = new Ably.Realtime({
      authCallback: async (tokenParams, callback) => {
        try {
          const res = await axios.post(`${API_URL}/ably/auth`, { user_id: user.id });
          callback(null, res.data);
        } catch (err) {
          callback(err, null);
        }
      },
    });

    setAblyClient(client);

    return () => {
      client.close();
      setAblyClient(null);
    };
  }, [user]);

  // Load chat history & subscribe to Ably channel
  useEffect(() => {
    if (!user || !ablyClient) return;

    // Load messages from backend
    const loadMessages = async () => {
      try {
        const res = await axios.get(`${API_URL}/chat/messages/${user.id}`, {
          params: { current_user_id: user.id },
        });
        if (Array.isArray(res.data)) {
          setMessages(
            res.data.map((msg) => ({
              id: msg.id || Math.random(),
              sender_id: msg.sender_id,
              receiver_id: msg.receiver_id,
              message: msg.message,
              sender_name: msg.sender_name || 'Unknown',
              timestamp: msg.timestamp || msg.created_at || new Date().toISOString(),
            }))
          );
        }
      } catch (err) {
        console.error('Error loading messages:', err);
      }
    };

    loadMessages();

    // Subscribe to user's channel for real-time messages
    if (channelRef.current) {
      channelRef.current.unsubscribe();
      channelRef.current = null;
    }

    const channel = ablyClient.channels.get(`chat:user_${user.id}`);

    const handleMessage = (msg) => {
      // Append only if message belongs to this conversation (between user and admin)
      if (
        (msg.data.sender_id === user.id && msg.data.receiver_id === adminUser.id) ||
        (msg.data.sender_id === adminUser.id && msg.data.receiver_id === user.id)
      ) {
        setMessages((prev) => {
          const exists = prev.some(
            (m) =>
              m.id === msg.data.id ||
              (m.timestamp === msg.data.timestamp &&
                m.sender_id === msg.data.sender_id &&
                m.message === msg.data.message)
          );
          if (exists) return prev;
          return [...prev, { ...msg.data, id: msg.data.id || Math.random() }];
        });
      }
    };

    channel.subscribe('message', handleMessage);

    channelRef.current = channel;

    return () => {
      if (channelRef.current) {
        channelRef.current.unsubscribe();
        channelRef.current = null;
      }
    };
  }, [user, ablyClient]);

  // Scroll chat to bottom on messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Send message
  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;

    try {
      await axios.post(`${API_URL}/chat/send`, {
        message: newMessage.trim(),
        receiver_id: adminUser.id,
        sender_id: user.id,
      });
      setNewMessage('');
      // No manual add, real-time subscription will add
    } catch (err) {
      console.error('Send message error:', err);
    }
  };

  if (!user) return <div>Please log in to chat</div>;

  return (
    <div style={{ maxWidth: 600, margin: 'auto' }}>
      <h2>Chat with Admin</h2>

      <div
        style={{
          height: 300,
          overflowY: 'auto',
          border: '1px solid #ddd',
          padding: 10,
          marginBottom: 8,
          backgroundColor: '#f9f9f9',
        }}
      >
        {messages.length === 0 ? (
          <div>No messages yet</div>
        ) : (
          messages.map((msg, i) => (
            <div key={`${msg.id}-${i}`} style={{ marginBottom: 10 }}>
              <div>
                <strong>{msg.sender_name}:</strong> {msg.message}
              </div>
              <div style={{ fontSize: 12, color: '#666' }}>
                {new Date(msg.timestamp).toLocaleTimeString()}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={sendMessage} style={{ display: 'flex', gap: 8 }}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          style={{ flexGrow: 1, padding: '8px' }}
        />
        <button type="submit" disabled={!newMessage.trim()}>
          Send
        </button>
      </form>
    </div>
  );
};

export default Chatbox;
