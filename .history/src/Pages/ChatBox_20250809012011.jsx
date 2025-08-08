import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as Ably from 'ably';

// Replace with your current user info, e.g. logged in user
const currentUser = { id: 1, name: 'John Doe', is_admin: false };
// Replace with your admin user info
const adminUser = { id: 2, name: 'Admin', is_admin: true };

const API_URL = 'http://192.168.1.104:8000/api';

const Chatbox = () => {
  const [messages, setMessages] = useState<Array<{
    sender_id: number;
    receiver_id: number;
    message: string;
    sender_name: string;
    timestamp: string;
  }>>([]);
  const [newMessage, setNewMessage] = useState('');
  const [ablyClient, setAblyClient] = useState<Ably.Realtime | null>(null);
  const [userChannel, setUserChannel] = useState<Ably.Types.RealtimeChannel | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize Ably realtime and subscribe to own channel
  useEffect(() => {
    const initAbly = async () => {
      try {
        setIsLoading(true);

        const client = new Ably.Realtime({
          authCallback: async (tokenParams, callback) => {
            try {
              const res = await axios.post(`${API_URL}/ably/auth`, {
                user_id: currentUser.id
              });
              callback(null, res.data);
            } catch (err) {
              console.error('authCallback error', err);
              callback(err as any, null);
            }
          }
        });

        setAblyClient(client);

        client.connection.once('connected', () => {
          const chan = client.channels.get(`chat:user_${currentUser.id}`);
          setUserChannel(chan);

          chan.subscribe('message', (msg) => {
            console.log('Received message:', msg.data);
            setMessages(prev => [...prev, msg.data]);
          });
        });
      } catch (err) {
        console.error('initAbly error', err);
        setError('Failed to initialize real-time connection');
      } finally {
        setIsLoading(false);
      }
    };

    initAbly();

    // Cleanup on unmount
    return () => {
      if (userChannel) userChannel.unsubscribe();
      if (ablyClient) ablyClient.close();
    };
  }, []); // run once

  // Load past messages from backend API
  useEffect(() => {
    const loadMessages = async () => {
      try {
        const res = await axios.get(`${API_URL}/chat/messages/${currentUser.id}`, {
          params: { current_user_id: currentUser.id }
        });
        // Clear old messages and load fresh ones
        setMessages(res.data || []);
      } catch (err) {
        console.error('loadMessages error', err);
        setError('Failed to load past messages');
      }
    };

    loadMessages();
  }, []);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    if (!ablyClient) {
      setError('Realtime client not initialized');
      return;
    }

    const payload = {
      sender_id: currentUser.id,
      receiver_id: adminUser.id,
      message: newMessage.trim(),
      sender_name: currentUser.name,  // <-- Make sure this is clean, no extra prefix
      timestamp: new Date().toISOString(),
    };

    try {
      // Publish to admin's channel
      const receiverChannel = ablyClient.channels.get(`chat:user_${adminUser.id}`);
      receiverChannel.publish('message', payload);

      // Save message in backend DB
      await axios.post(`${API_URL}/chat/send`, {
        message: newMessage.trim(),
        receiver_id: adminUser.id,
        sender_id: currentUser.id,
      });

      // Update local messages for instant UI update
      setMessages(prev => [...prev, payload]);
      setNewMessage('');
    } catch (err) {
      console.error('sendMessage error', err);
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
        {messages.length === 0 && <div>No messages yet</div>}
        {messages.map((msg, i) => {
          // Debug print sender_name in console
          console.log(`Rendering message #${i}`, msg.sender_name);

          return (
            <div key={i} style={{ marginBottom: 10 }}>
              <div><strong>{msg.sender_name}:</strong> {msg.message}</div>
              <div style={{ fontSize: 12, color: '#666' }}>
                {new Date(msg.timestamp).toLocaleTimeString()}
              </div>
            </div>
          );
        })}
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
