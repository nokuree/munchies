import React, { useState } from 'react';
import axios from 'axios';
import GeolocationComponent from './Geolocation';
import ReactMarkdown from 'react-markdown';

function Chat() {
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await axios.post('http://localhost:8000/api/chatgpt/', { message });
    setChat([...chat, { type: 'user', text: message }, { type: 'bot', text: response.data.reply }]);
    setMessage('');
  };

  return (
    <div className="App">
      <h1 style={{ color: 'white' }}>Chat with OpenAI</h1>
      <div className="chat-box">
        {chat.map((msg, index) => (
          <div style={{ color: 'white' }} key={index} className={`chat-message ${msg.type}`}>
            {msg.type === 'bot' ? (
              <ReactMarkdown>{msg.text}</ReactMarkdown>
            ) : (
              msg.text
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
      <GeolocationComponent />
    </div>
  );
}

export default Chat;
