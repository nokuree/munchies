import React, { useState } from 'react';
import axios from 'axios';
import GeolocationComponent from './Geolocation';
import ReactMarkdown from 'react-markdown';
import '../Chat.css';

function Chat({ restaurants }) {
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    try {
      const response = await fetch("http://localhost:8000/api/chat/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message,
          restaurants, // Send the restaurants data
        }),
      });
      const data = await response.json();

      setChat((prevChat) => [
        ...prevChat,
        { type: 'user', text: message },
        { type: 'bot', text: data.reply },
      ]);

      setMessage(''); // Clear the message input
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="App">
      <h1 style={{ color: 'white' }}>Munchies AI</h1>
      <div className="chat-box">
        {Array.isArray(chat) && chat.map((msg, index) => (
          <div style={{ color: 'white' }} key={index} className={`chat-message ${msg.type}`}>
            {msg.type === 'bot' ? (
              <ReactMarkdown>{msg.text}</ReactMarkdown>
            ) : (
              <span classname="user-message">{msg.text}</span>
            )}
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

export default Chat;
