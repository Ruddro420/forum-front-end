import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import * as Ably from 'ably';

// Example logged-in user info (replace with your auth)
const currentUser = { id: 2, name: 'Ali Ruddro', is_admin: false };
const adminUser = { id: 1, name: 'Admin', is_admin: true };

const API_URL = 'http://127.0.0.1:8000/api';

const UserChat = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [ablyClient, setAblyClient] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Initialize Ably once
  useEffect(() => {
    const client = new Ably.Realtime({
      authUrl: `${API_URL}/ably/auth`,
      authMethod: 'POST',
      authHeaders: { 'Content-Type': 'application/json' },
      authParams: { user_id: currentUser.id }
    });

    setAblyClient(client);

    return () => client.close();
  }, []);

  // Load past messages + subscribe to own channel
  useEffect(() => {
    if (!ablyClient) return;

    setIsLoading(true);

    // Fetch previous messages from backend
    axios.get(`${API_URL}/chat/messages/${currentUser.id}`, {
      params: { current_user_id: currentUser.id }
    })
      .then(res => {
        setMessages(res.data || []);
        setIsLoading(false);
      })
      .catch(err => {
        setError('Failed to load messages');
        setIsLoading(false);
      });

    // Subscribe to own channel
    const channel = ablyClient.channels.get(`chat:user_${currentUser.id}`);

    const handleMessage = (msg) => {
      const data = msg.data;
      if (!data) return;

      setMessages(prev => {
        const exists = prev.some(m =>
          m.timestamp === data.timestamp &&
          m.sender_id === data.sender_id &&
          m.message === data.message
        );
        if (exists) return prev;
        return [...prev, data];
      });
    };

    channel.subscribe('message', handleMessage);

    return () => {
      channel.unsubscribe('message', handleMessage);
    };
  }, [ablyClient]);

  // Send message (don't add locally, wait for Ably message)
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
      await axios.post(`${API_URL}/chat/send`, payload);
      setNewMessage('');
    } catch {
      setError('Failed to send message');
    }
  };

  if (isLoading) return <div>Loading chat...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div style={{ maxWidth: 600, margin: 'auto', display: 'flex', flexDirection: 'column', height: '80vh' }}>
      <h2>Chat with Admin</h2>

      <div style={{
        flexGrow: 1,
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

export default UserChat;
