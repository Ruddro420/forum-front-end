import React, { useState, useEffect, useRef, useMemo } from 'react';
import axios from 'axios';
import * as Ably from 'ably';
import { useAuth } from '../Auth/context/AuthContext';
import { Send, Smile, Paperclip, Mic } from 'lucide-react';

const API_URL = 'http://192.168.1.104:8000/api';
const adminUser = { id: 1, name: 'Admin', avatar: '/admin-avatar.jpg' };

const Chatbox = () => {
  const { user } = useAuth();
  const currentUser = useMemo(() => {
    if (!user) return null;
    return { id: user.id, name: `${user.first_name} ${user.last_name}`, avatar: user.avatar || '/user-avatar.jpg' };
  }, [user]);

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const ablyClientRef = useRef(null);
  const channelRef = useRef(null);

  useEffect(() => {
    if (!currentUser) return;
    if (ablyClientRef.current) ablyClientRef.current.close();
    const client = new Ably.Realtime({
      authCallback: async (tokenParams, callback) => {
        try {
          const res = await axios.post(`${API_URL}/ably/auth`, { user_id: currentUser.id });
          callback(null, res.data);
        } catch (err) { callback(err, null); }
      },
    });
    ablyClientRef.current = client;
    return () => { client.close(); ablyClientRef.current = null; };
  }, [currentUser]);

  useEffect(() => {
    if (!currentUser) return;
    const loadMessages = async () => {
      try {
        const res = await axios.get(`${API_URL}/chat/messages/${adminUser.id}`, { params: { current_user_id: currentUser.id } });
        const formatted = (res.data || []).map((msg) => ({
          ...msg,
          sender_name: msg.sender_name || 'Unknown',
          timestamp: msg.timestamp || msg.created_at || new Date().toISOString(),
        }));
        setMessages(formatted);
      } catch (err) { console.error('Load messages error:', err); setError('Failed to load messages'); }
    };
    loadMessages();
  }, [currentUser]);

  useEffect(() => {
    if (!currentUser || !ablyClientRef.current) return;
    const client = ablyClientRef.current;
    if (channelRef.current) { channelRef.current.unsubscribe(); channelRef.current = null; }
    const subscribe = () => {
      const channel = client.channels.get(`chat:user_${currentUser.id}`);
      channel.subscribe('message', (msg) => {
        setMessages((prev) => {
          const exists = prev.some(m => m.id === msg.data.id || (m.timestamp === msg.data.timestamp && m.message === msg.data.message));
          if (exists) return prev;
          return [...prev, { ...msg.data, sender_name: msg.data.sender_name || 'Unknown' }];
        });
      });
      channelRef.current = channel;
    };
    if (client.connection.state === 'connected') subscribe();
    else client.connection.once('connected', subscribe);
    return () => { if (channelRef.current) { channelRef.current.unsubscribe(); channelRef.current = null; } };
  }, [currentUser]);

  useEffect(() => { if (messagesEndRef.current) messagesEndRef.current.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

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
      const res = await axios.get(`${API_URL}/chat/messages/${adminUser.id}`, { params: { current_user_id: currentUser.id } });
      const formatted = (res.data || []).map((msg) => ({
        ...msg,
        sender_name: msg.sender_name || 'Unknown',
        timestamp: msg.timestamp || msg.created_at || new Date().toISOString(),
      }));
      setMessages(formatted);
    } catch (err) { console.error('Send message error:', err); setError('Failed to send message'); }
  };

  if (!currentUser) return <div className="flex items-center justify-center h-screen">Please log in to chat</div>;
  if (error) return <div className="flex items-center justify-center h-screen text-red-500">{error}</div>;

  return (
    <div className="flex flex-col h-[90vh] bg-gray-50">
      <div className="flex items-center justify-between p-3 bg-white border-b border-gray-200 shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <img src="https://cdn-icons-png.flaticon.com/128/64/64572.png" alt="Admin" className="w-10 h-10 rounded-full object-cover border-2 border-white shadow" />
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
          </div>
          <div>
            <h2 className="font-semibold text-gray-800">Admin Support</h2>
            <p className="text-xs text-gray-500">Active now</p>
          </div>
        </div>
        {/* <div className="flex space-x-4">
          <button className="text-gray-600 hover:text-gray-800">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </button>
          <button className="text-gray-600 hover:text-gray-800">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </button>
          <button className="text-gray-600 hover:text-gray-800">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </button>
        </div> */}
      </div>

      <div className="flex-1 overflow-y-auto p-4 bg-[#e5ddd5] bg-opacity-30 bg-[url('https://web.whatsapp.com/img/bg-chat-tile-light_a4be512e7195b6b733d9110b408f075d.png')]">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-2 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <p>No messages yet</p>
            <p className="text-sm">Start the conversation</p>
          </div>
        ) : (
          <div className="space-y-1">
            {messages.map((msg, i) => {
              const isMe = msg.sender_id === currentUser.id;
              const isConsecutive = i > 0 && messages[i-1].sender_id === msg.sender_id;
              const showAvatar = !isConsecutive || i === 0;
              
              return (
                <div key={msg.id || i} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex max-w-xs lg:max-w-md ${isMe ? 'flex-row-reverse' : ''}`}>
                    {showAvatar && (
                      <div className={`flex-shrink-0 ${isMe ? 'ml-3' : 'mr-3'}`}>
                        <img src={isMe ? "https://cdn-icons-png.flaticon.com/128/3177/3177440.png" : "https://cdn-icons-png.flaticon.com/128/64/64572.png"} alt={isMe ? 'You' : 'Admin'} 
                          className="w-8 h-8 rounded-full object-cover border-2 border-white shadow" />
                      </div>
                    )}
                    {!showAvatar && <div className={`w-8 ${isMe ? 'ml-3' : 'mr-3'}`}></div>}
                    <div className={`px-3 py-2 rounded-lg ${isMe ? 'bg-blue-500 text-white rounded-br-none' : 'bg-white text-gray-800 rounded-bl-none shadow-sm border border-gray-200'}`}>
                      <p className="text-sm">{msg.message}</p>
                      <div className="flex items-center justify-end mt-1 space-x-1">
                        <span className="text-xs opacity-70">
                          {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        {isMe && (
                          <span className="text-xs">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-blue-200" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      <div className="p-3 bg-white border-t border-gray-200">
        {messages.length === 0 && (
          <div className="flex space-x-2 mb-3 overflow-x-auto pb-2">
            {["Hello!", "I need help", "What's your hours?", "Thanks"].map((text, i) => (
              <button key={i} onClick={() => setNewMessage(text)}
                className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-full text-sm whitespace-nowrap transition-colors">
                {text}
              </button>
            ))}
          </div>
        )}
        <form onSubmit={sendMessage} className="flex items-center space-x-2">
          <button type="button" className="p-2 rounded-full hover:bg-gray-100 text-gray-500">
            <Smile className="h-5 w-5" />
          </button>
          <button type="button" className="p-2 rounded-full hover:bg-gray-100 text-gray-500">
            <Paperclip className="h-5 w-5" />
          </button>
          <div className="flex-1 relative">
            <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} 
              placeholder="Type a message..." className="w-full border border-gray-300 rounded-full px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            <button type="button" className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600">
              <Mic className="h-5 w-5" />
            </button>
          </div>
          <button type="submit" disabled={!newMessage.trim()} 
            className={`p-2 rounded-full text-white ${newMessage.trim() ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-300 cursor-not-allowed'}`}>
            <Send className="h-5 w-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chatbox;