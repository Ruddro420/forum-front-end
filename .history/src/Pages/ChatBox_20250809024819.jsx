import React, { useState, useEffect, useRef, useMemo } from 'react';
import axios from 'axios';
import * as Ably from 'ably';
import { useAuth } from '../Auth/context/AuthContext';

const API_URL = 'http://192.168.1.104:8000/api';

const Chatbox = () => {
  const { user } = useAuth();

  const currentUser = useMemo(() => {
    if (!user) return null;
    return {
      id: user.id,
      name: `${user.first_name} ${user.last_name}`,
      is_admin: user.is_admin || false,
    };
  }, [user]);

  const adminUser = { id: 1, name: 'Admin', is_admin: true };

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  const ablyClientRef = useRef(null);
  const channelRef = useRef(null);

  // Initialize Ably client on user change
  useEffect(() => {
    if (!currentUser) return;

    // Close old client
    if (ablyClientRef.current) {
      ablyClientRef.current.close();
      ablyClientRef.current = null;
    }

    const client = new Ably.Realtime({
      authCallback: async (tokenParams, callback) => {
        try {
          const res = await axios.post(`${API_URL}/ably/auth`, { user_id: currentUser.id });
          callback(null, res.data);
        } catch (err) {
          console.error('Ably auth error:', err);
          callback(err, null);
        }
      },
    });

    ablyClientRef.current = client;

    return () => {
      if (ablyClientRef.current) {
        ablyClientRef.current.close();
        ablyClientRef.current = null;
      }
    };
  }, [currentUser]);

  // Load messages once when currentUser changes
  useEffect(() => {
    if (!currentUser) return;

    // Clear old messages before loading new ones
    setMessages([]);

    const loadMessages = async () => {
      try {
        const res = await axios.get(`${API_URL}/chat/messages/${currentUser.id}`, {
          params: { current_user_id: currentUser.id },
        });

        const normalized = (res.data || []).map((msg) => ({
          ...msg,
          sender_name: msg.sender_name || 'Unknown',
          timestamp: msg.timestamp || msg.created_at || new Date().toISOString(),
          uniqueKey: `${msg.id || Math.random()}_${msg.timestamp}`, // Add unique key for React list rendering
        }));

        setMessages(normalized);
      } catch (err) {
        console.error('loadMessages error:', err);
        setError('Failed to load messages');
      }
    };

    loadMessages();
  }, [currentUser]);

  // Subscribe to Ably real-time messages
  useEffect(() => {
    if (!currentUser || !ablyClientRef.current) return;

    const client = ablyClientRef.current;

    if (channelRef.current) {
      channelRef.current.unsubscribe();
      channelRef.current = null;
    }

    const subscribeToChannel = () => {
      const channel = client.channels.get(`chat:user_${currentUser.id}`);

      channel.subscribe('message', (msg) => {
        if (!msg.data) return;

        setMessages((prev) => {
          // Avoid duplicates by comparing unique fields
          const exists = prev.some(
            (m) =>
              m.timestamp === msg.data.timestamp &&
              m.message === msg.data.message &&
              m.sender_id === msg.data.sender_id
          );
          if (exists) return prev;
          return [...prev, msg.data];
        });
      });

      channelRef.current = channel;
    };

    if (client.connection.state === 'connected') {
      subscribeToChannel();
    } else {
      client.connection.once('connected', subscribeToChannel);
    }

    return () => {
      if (channelRef.current) {
        channelRef.current.unsubscribe();
        channelRef.current = null;
      }
    };
  }, [currentUser]);

  // Scroll chat to bottom on messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Send message
  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentUser) return;

    const payload = {
      sender_id: currentUser.id,
      receiver_id: adminUser.id,
      message: newMessage.trim(),
      sender_name: currentUser.name,
      timestamp: new Date().toISOString(),
    };

    try {
      await axios.post(`${API_URL}/chat/send`, {
        message: payload.message,
        receiver_id: payload.receiver_id,
        sender_id: payload.sender_id,
      });

      setNewMessage('');
      // Do not add message manually; rely on real-time subscription to update
    } catch (err) {
      console.error('sendMessage error:', err);
      setError('Failed to send message');
    }
  };

  if (!currentUser) return <div>Please log in to chat</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

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
          messages.map((msg) => (
            <div key={msg.uniqueKey || msg.timestamp} style={{ marginBottom: 10 }}>
              <div>
                <strong>{msg.sender_name}:</strong> {msg.message}
              </div>
              <div style={{ fontSize: 12, color: '#666' }}>
                {isNaN(new Date(msg.timestamp).getTime())
                  ? 'Invalid date'
                  : new Date(msg.timestamp).toLocaleTimeString()}
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
