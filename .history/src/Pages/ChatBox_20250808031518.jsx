import React, { useEffect, useState, useRef } from 'react';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import axios from 'axios';

const ChatBox = ({ authUser, receiverId }) => {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const messagesEndRef = useRef(null);

  // Setup Echo
  useEffect(() => {
    window.Pusher = Pusher;
    window.Echo = new Echo({
      broadcaster: 'pusher',
      key: 'ca3f1e2e259a66672309', // ⚠️ from your .env
      cluster: 'mt1',
      wsHost: window.location.hostname,
      wsPort: 6001,
      forceTLS: false,
      disableStats: true,
      authEndpoint: 'http://192.168.1.104:8000/broadcasting/auth',
      auth: {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`, // if using token
        },
      },
    });

    const ids = [authUser.id, receiverId].sort((a, b) => a - b);
    const channelName = `chat.${ids[0]}.${ids[1]}`;

    window.Echo.private(channelName).listen('MessageSent', (e) => {
      setMessages((prev) => [...prev, e.message]);
    });

    return () => {
      window.Echo.leave(channelName);
    };
  }, [authUser.id, receiverId]);

  // Load messages
  useEffect(() => {
    axios
      .get(`http://192.168.1.104:8000/api/messages/${receiverId}`)
      .then((res) => setMessages(res.data));
  }, [receiverId]);

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    const res = await axios.post(`http://192.168.1.104:8000/api/messages`, {
      receiver_id: receiverId,
      message: text,
    });

    setMessages((prev) => [...prev, res.data]);
    setText('');
  };

  return (
    <div className="max-w-md mx-auto border rounded shadow p-4 bg-white">
      <h2 className="text-xl font-semibold mb-4">Chat with User #{receiverId}</h2>
      <div className="h-64 overflow-y-auto border p-2 mb-2 bg-gray-50 rounded">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`mb-2 p-2 rounded ${
              msg.sender_id === authUser.id ? 'bg-blue-100 text-right' : 'bg-gray-200 text-left'
            }`}
          >
            {msg.message}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={sendMessage} className="flex gap-2">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-1 border rounded px-2 py-1"
          placeholder="Type your message..."
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatBox;
