import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import * as Ably from 'ably';
import { useAuth } from '../Auth/context/AuthContext';

// User info
const currentUser = { id: 1, name: 'John Doe', is_admin: false };
const adminUser = { id: 1, name: 'Admin', is_admin: true };

const API_URL = 'http://192.168.1.104:8000/api';

const Chatbox = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [ablyClient, setAblyClient] = useState(null);
  const channelRef = useRef(null); // keep stable reference
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);


  // Scroll ref for messages container
  const messagesEndRef = useRef(null);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Initialize Ably and subscription (only once)
  useEffect(() => {
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
              callback(err, null);
            }
          }
        });

        setAblyClient(client);

        client.connection.once('connected', () => {
          channel = client.channels.get(`chat:user_${currentUser.id}`);

          // Unsubscribe previous if any
          if (channelRef.current) {
            channelRef.current.unsubscribe();
          }

          channel.subscribe('message', (msg) => {
            if (!msg.data) return;

            // Avoid duplicates by checking message id or timestamp + content
            // Here we'll check timestamp + message + sender
            setMessages(prevMessages => {
              const exists = prevMessages.some(m =>
                m.timestamp === msg.data.timestamp &&
                m.message === msg.data.message &&
                m.sender_id === msg.data.sender_id
              );
              if (exists) return prevMessages;
              return [...prevMessages, msg.data];
            });
          });

          channelRef.current = channel;
        });
      } catch (err) {
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
  }, []);

  // Load initial messages once on mount
  useEffect(() => {
    const loadMessages = async () => {
      try {
        const res = await axios.get(`${API_URL}/chat/messages/${currentUser.id}`, {
          params: { current_user_id: currentUser.id }
        });

        // Normalize messages: ensure sender_name and timestamp exist
        const normalized = (res.data || []).map(msg => ({
          ...msg,
          sender_name: msg.sender_name || 'Unknown',
          timestamp: msg.timestamp || msg.created_at || new Date().toISOString()
        }));

        setMessages(normalized);
      } catch {
        setError('Failed to load messages');
      }
    };

    loadMessages();
  }, []);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !ablyClient) return;

    const payload = {
      sender_id: currentUser.id,
      receiver_id: adminUser.id,
      message: newMessage.trim(),
      sender_name: currentUser.name,
      timestamp: new Date().toISOString(),
    };

    try {
      // Publish to admin channel
      const receiverChannel = ablyClient.channels.get(`chat:user_${adminUser.id}`);
      receiverChannel.publish('message', payload);

      // Save to DB
      await axios.post(`${API_URL}/chat/send`, {
        message: payload.message,
        receiver_id: payload.receiver_id,
        sender_id: payload.sender_id,
      });

      // Add message locally
      setMessages(prev => [...prev, payload]);
      setNewMessage('');
    } catch {
      setError('Failed to send message');
    }
  };

  if (isLoading) return <div>Loading chat...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div style={{ maxWidth: 600, margin: 'auto' }}>
      <h2>Chat with Admin</h2>

      <div style={{
        height: 300,
        overflowY: 'auto',
        border: '1px solid #ddd',
        padding: 10,
        marginBottom: 8,
        backgroundColor: '#f9f9f9'
      }}>
        {messages.length === 0 ? (
          <div>No messages yet</div>
        ) : (
          messages.map((msg, i) => (
            <div key={i} style={{ marginBottom: 10 }}>
              <div><strong>{msg.sender_name}:</strong> {msg.message}</div>
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
          onChange={e => setNewMessage(e.target.value)}
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
