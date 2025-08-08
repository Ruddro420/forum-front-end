import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import * as Ably from 'ably';

const API_URL = 'http://192.168.1.104:8000/api';

// Replace with actual logged-in user info
const currentUser = { id: 2, name: 'User John', is_admin: false };
const adminUser = { id: 1, name: 'Admin', is_admin: true };

const Chatbox = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [ablyClient, setAblyClient] = useState(null);
  const messagesEndRef = useRef(null);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Initialize Ably client and subscribe
  useEffect(() => {
    const client = new Ably.Realtime({
      authCallback: async (tokenParams, callback) => {
        try {
          const res = await axios.post(`${API_URL}/ably/auth`, {
            user_id: currentUser.id,
          });
          callback(null, res.data);
        } catch (err) {
          callback(err, null);
        }
      },
    });

    setAblyClient(client);

    client.connection.once('connected', () => {
      const channel = client.channels.get(`chat:user_${currentUser.id}`);

      const handleMessage = (msg) => {
        const data = msg.data;
        setMessages((prev) => {
          const exists = prev.some(
            (m) =>
              m.timestamp === data.timestamp &&
              m.sender_id === data.sender_id &&
              m.message === data.message
          );
          if (exists) return prev;
          return [...prev, data];
        });
      };

      channel.subscribe('message', handleMessage);

      // Cleanup on unmount
      return () => {
        channel.unsubscribe('message', handleMessage);
        client.close();
      };
    });

    // Load historical messages once
    const loadMessages = async () => {
      try {
        const res = await axios.get(`${API_URL}/chat/messages/${currentUser.id}`, {
          params: { current_user_id: currentUser.id },
        });
        setMessages(res.data);
      } catch (err) {
        console.error('Failed to load messages:', err);
      }
    };

    loadMessages();
  }, []);

  // Send message: only clear input, don't add locally (avoid duplicates)
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
      // Send message to backend (backend publishes via Ably)
      await axios.post(`${API_URL}/chat/send`, payload);

      // Clear input only
      setNewMessage('');
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

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
              <strong>{msg.sender_name}:</strong> {msg.message}
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
