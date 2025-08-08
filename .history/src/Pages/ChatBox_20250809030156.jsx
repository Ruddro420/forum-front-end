import React, { useState, useEffect, useRef, useMemo } from 'react';
import axios from 'axios';
import * as Ably from 'ably';
import { useAuth } from '../Auth/context/AuthContext';

const API_URL = 'http://192.168.1.104:8000/api';

const adminUser = { id: 1, name: 'Admin', is_admin: true };

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

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [ablyClient, setAblyClient] = useState(null);
  const channelRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Initialize Ably client on user change
  useEffect(() => {
    if (!currentUser) return;

    if (ablyClient) {
      ablyClient.close();
      setAblyClient(null);
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

    setAblyClient(client);

    return () => {
      client.close();
      setAblyClient(null);
    };
  }, [currentUser]);

  // Load messages and subscribe to channel on ablyClient or user change
  useEffect(() => {
    if (!currentUser || !ablyClient) return;

    setMessages([]); // clear old messages

    // Load message history from backend
    const loadMessages = async () => {
      try {
        const res = await axios.get(`${API_URL}/chat/messages/${currentUser.id}`, {
          params: { current_user_id: currentUser.id },
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
        console.error('Failed to load messages:', err);
      }
    };

    loadMessages();

    // Subscribe to Ably channel
    if (channelRef.current) {
      channelRef.current.unsubscribe();
      channelRef.current = null;
    }

    const channel = ablyClient.channels.get(`chat:user_${currentUser.id}`);

    const handleMessage = (msg) => {
      // Append new message if it belongs to this chat (optional filtering)
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
    };

    channel.subscribe('message', handleMessage);

    channelRef.current = channel;

    return () => {
      if (channelRef.current) {
        channelRef.current.unsubscribe();
        channelRef.current = null;
      }
    };
  }, [currentUser, ablyClient]);

  // Scroll to bottom on messages update
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
      // No need to manually add; will update from Ably subscription
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  if (!currentUser) return <div>Please log in to chat</div>;

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
