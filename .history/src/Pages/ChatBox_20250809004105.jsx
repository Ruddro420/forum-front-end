import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as Ably from 'ably';

// Example current user (non-admin)
const currentUser = { id: 2, name: 'John Doe', is_admin: false };
// Admin user
const adminUser = { id: 1, name: 'Admin', is_admin: true };

const API_URL = 'http://192.168.1.104:8000/api';

function Chatbox() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [ablyClient, setAblyClient] = useState(null);
  const [userChannel, setUserChannel] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    initAbly();
    loadMessages();
    // cleanup on unmount
    return () => {
      if (userChannel) userChannel.unsubscribe();
      if (ablyClient) ablyClient.close();
    }
    // eslint-disable-next-line
  }, []);

  const initAbly = async () => {
    try {
      setIsLoading(true);

      const client = new Ably.Realtime({
        authCallback: async (tokenParams, callback) => {
          try {
            const res = await axios.post(`${API_URL}/ably/auth`, {
              user_id: currentUser.id
            });
            // Ably expects the JSON token request response
            callback(null, res.data);
          } catch (err) {
            console.error('authCallback error', err);
            callback(err, null);
          }
        }
      });

      setAblyClient(client);

      client.connection.once('connected', () => {
        const chan = client.channels.get(`chat:user_${currentUser.id}`);
        setUserChannel(chan);

        chan.subscribe('message', (msg) => {
          setMessages(prev => [...prev, msg.data]);
        });
      });
    } catch (err) {
      console.error('initAbly err', err);
      setError('Failed to initialize Ably');
    } finally {
      setIsLoading(false);
    }
  };

  const loadMessages = async () => {
    try {
      const res = await axios.get(`${API_URL}/chat/messages/${currentUser.id}`, {
        params: { current_user_id: currentUser.id }
      });
      setMessages(res.data || []);
    } catch (err) {
      console.error('loadMessages err', err);
      setError('Failed to load messages');
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    if (!ablyClient) {
      setError('Realtime not initialized');
      return;
    }

    const payload = {
      sender_id: currentUser.id,
      receiver_id: adminUser.id,
      message: newMessage,
      sender_name: currentUser.name,
      timestamp: new Date().toISOString(),
    };

    try {
      // Publish to receiver's channel (so admin receives it)
      const receiverChannel = ablyClient.channels.get(`chat:user_${adminUser.id}`);
      receiverChannel.publish('message', payload);

      // Save to DB via API
      await axios.post(`${API_URL}/chat/send`, {
        message: newMessage,
        receiver_id: adminUser.id,
        sender_id: currentUser.id
      });

      // Optimistic UI
      setMessages(prev => [...prev, payload]);
      setNewMessage('');
    } catch (err) {
      console.error('sendMessage err', err);
      setError('Failed to send message');
    }
  };

  if (isLoading) return <div>Loading chat...</div>;
  if (error) return <div style={{color:'red'}}>{error}</div>;

  return (
    <div className="user-chat-container">
      <h2>Chat with Admin</h2>

      <div className="messages" style={{height:300, overflowY:'auto', border:'1px solid #ddd', padding:10}}>
        {messages.map((msg, i) => (
          <div key={i} style={{marginBottom:8}}>
            <div><strong>{msg.sender_name}:</strong> {msg.message}</div>
            <div style={{fontSize:12, color:'#666'}}>{new Date(msg.timestamp).toLocaleTimeString()}</div>
          </div>
        ))}
      </div>

      <form onSubmit={sendMessage} style={{marginTop:8}}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type message..."
          style={{width:'70%'}}
        />
        <button type="submit" disabled={!newMessage.trim()}>Send</button>
      </form>
    </div>
  );
}

export default Chatbox;
