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

  // Initialize Ably Realtime client once per user
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

  // Load chat history when user changes
  useEffect(() => {
    if (!currentUser) return;

    setMessages([]); // clear old messages

    const loadMessages = async () => {
      try {
        const res = await axios.get(`${API_URL}/chat/messages/${currentUser.id}`, {
          params: { current_user_id: currentUser.id },
        });

        console.log('Loaded messages:', res.data);

        const normalized = (res.data || []).map((msg) => ({
          id: msg.id,
          sender_id: msg.sender_id,
          receiver_id: msg.receiver_id,
          message: msg.message,
          sender_name: msg.sender_name || 'Unknown',
          timestamp: msg.timestamp || msg.created_at || new Date().toISOString(),
        }));

        setMessages(normalized);
      } catch (err) {
        console.error('Load messages error:', err);
        setError('Failed to load messages');
      }
    };

    loadMessages();
  }, [currentUser]);

  // Subscribe to Ably channel for realtime updates
  useEffect(() => {
    if (!currentUser || !ablyClientRef.current) return;

    const client = ablyClientRef.current;

    // Cleanup previous subscription
    if (channelRef.current) {
      channelRef.current.unsubscribe();
      channelRef.current = null;
    }

    const subscribe = () => {
      const channel = client.channels.get(`chat:user_${currentUser.id}`);

      channel.subscribe('message', (msg) => {
        setMessages((prev) => {
          // Avoid duplicate messages by checking ID
          const exists = prev.some((m) => m.id === msg.data.id);
          if (exists) return prev;
          console.log('New realtime message:', msg.data);
          return [...prev, msg.data];
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
      }
    };
  }, [currentUser]);

  // Scroll chat to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Send message handler
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
      // Do NOT add locally here. Wait for realtime subscription.
    } catch (err) {
      console.error('Send message error:', err);
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
            <div key={msg.id} style={{ marginBottom: 10 }}>
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
