// ChatComponent.js
import React, { useState } from 'react';
import axios from 'axios';

const Chat = ({ onGetRecommendations }) => {
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');

  const handleSendMessage = async () => {
    try {
      const res = await axios.post('/api/chat_with_gpt/', { message });
      const gptResponse = res.data.response;
      setResponse(gptResponse);
      onGetRecommendations(gptResponse); // Pass the response to parent for further processing
    } catch (error) {
      console.error('Error chatting with GPT:', error);
    }
  };

  return (
    <div>
      <h2>Chat with GPT</h2>
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        rows="4"
        cols="50"
      />
      <button onClick={handleSendMessage}>Send</button>
      <p>Response: {response}</p>
    </div>
  );
};

export default Chat;
