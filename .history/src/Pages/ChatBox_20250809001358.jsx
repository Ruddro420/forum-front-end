// src/App.js (standalone React app)
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as Ably from 'ably';

// Static user for the standalone app (in a real app, you would get this from authentication)
const currentUser = {
  id: 2, // Example user ID (not admin)
  name: 'John Doe',
  is_admin: false,
};

// Static admin user
const adminUser = {
  id: 1,
  name: 'Admin',
  is_admin: true,
};

// Base URL for your Laravel API
const API_URL = 'http://192.168.1.104:8000/api';

function ChatBox() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [ably, setAbly] = useState(null);
  const [channel, setChannel] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    initAbly();
    loadMessages();
  }, []);

  const initAbly = async () => {
    try {
      setIsLoading(true);
      const response = await axios.post(`${API_URL}/ably/auth`, { user_id: currentUser.id });
      const tokenRequest = response.data;

      const ablyClient = new Ably.Realtime({ authCallback: tokenRequest });
      setAbly(ablyClient);

      // Connect to user's channel
      const userChannel = ablyClient.channels.get(`chat:user_${currentUser.id}`);
      setChannel(userChannel);

      // Subscribe to messages
      userChannel.subscribe('message', (message) => {
        setMessages(prev => [...prev, message.data]);
      });
    } catch (err) {
      console.error('Error initializing Ably:', err);
      setError('Failed to initialize chat. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const loadMessages = async () => {
    try {
      const response = await axios.get(`${API_URL}/chat/messages/${currentUser.id}`, {
        params: { current_user_id: currentUser.id }
      });
      setMessages(response.data);
    } catch (err) {
      console.error('Error loading messages:', err);
      setError('Failed to load messages. Please try again.');
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !channel) return;

    const messageData = {
      sender_id: currentUser.id,
      receiver_id: adminUser.id,
      message: newMessage,
      sender_name: currentUser.name,
      timestamp: new Date().toISOString(),
    };

    try {
      // Send to Ably
      channel.publish('message', messageData);

      // Save to database
      await axios.post(`${API_URL}/chat/send`, {
        message: newMessage,
        receiver_id: adminUser.id,
        sender_id: currentUser.id,
      });

      setNewMessage('');
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Failed to send message. Please try again.');
    }
  };

  if (isLoading) {
    return <div className="chat-loading">Loading chat...</div>;
  }

  if (error) {
    return <div className="chat-error">{error}</div>;
  }

  return (
    <div className="user-chat-container">
      <div className="chat-header">
        <h2>Chat with Admin</h2>
      </div>

      <div className="messages">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message ${msg.sender_id === currentUser.id ? 'sent' : 'received'}`}
          >
            <div className="message-content">
              <strong>{msg.sender_name}: </strong> {msg.message}
            </div>
            <div className="time">
              {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={sendMessage} className="message-form">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          disabled={isLoading}
        />
        <button type="submit" disabled={!newMessage.trim() || isLoading}>
          Send
        </button>
      </form>
    </div>
  );
}

export default ChatBox;