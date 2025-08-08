import React, { useState, useEffect, useRef, useMemo } from 'react';
import axios from 'axios';
import * as Ably from 'ably';
import { useAuth } from '../Auth/context/AuthContext';

const API_URL = 'http://192.168.1.104:8000/api';

const Chatbox = () => {
  const { user } = useAuth();
  const userId = user?.id;

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
  const [ablyClient, setAblyClient] = useState(null);
  const channelRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  // Initialize Ably client and subscribe once
  useEffect(() => {
    if (!currentUser) return;

    let client;
    let channel;

    const initAbly = async () => {
      try {
        setIsLoading(true);

        client = new Ably.Realtime({
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

        setAblyClient(client);

        client.connection.once('connected', () => {
          channel = client.channels.get(`chat:user_${currentUser.id}`);

          // Unsubscribe if any previous subscription exists
          if (channelRef.current) {
            channelRef.current.unsubscribe();
          }

          channel.subscribe('message', (msg) => {
            if (!msg.data) return;

            setMessages((prev) => {
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
        });
      } catch (err) {
        console.error('initAbly error:', err);
        setError('Failed to initialize realtime connection');
      } finally {
        setIsLoading(false);
      }
    };

    initAbly();

    return () => {
      if (channelRef.current) channelRef.current.unsubscribe();
      if (client) client.close();
    };
  }, [currentUser]);

  // Load initial chat messages
  useEffect(() => {
    if (!currentUser) return;

    const loadMessages = async () => {
      try {
        const res = await axios.get(`${API_URL}/chat/messages/${currentUser.id}`, {
          params: { current_user_id: currentUser.id },
        });

        const normalized = (res.data || []).map((msg) => ({
          ...msg,
          sender_name: msg.sender_name || 'Unknown',
          timestamp: msg.timestamp || msg.created_at || new Date().toISOString(),
        }));

        setMessages(normalized);
      } catch (err) {
        console.error('loadMessages error:', err);
        setError('Failed to load messages');
      }
    };

    loadMessages();
  }, [currentUser]);

  // Scroll chat to bottom on new messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Send message via backend only — backend will publish to Ably for real-time updates
  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !ablyClient || !currentUser) return;

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

      // Do NOT add message locally here — wait for subscription to add it
      setNewMessage('');
    } catch (err) {
      console.error('sendMessage error:', err);
      setError('Failed to send message');
    }
  };

  if (!currentUser) return <div>Please log in to chat</div>;
  if (isLoading) return <div>Loading chat...</div>;
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
          messages.map((msg, i) => (
            <div key={i} style={{ marginBottom: 10 }}>
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
