import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Button, Form, Modal, Toast } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure Bootstrap CSS is imported

function Chat({ restaurants }) {
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8000/api/chat/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message,
          restaurants,
        }),
      });
      const data = await response.json();

      setChat((prevChat) => [
        ...prevChat,
        { type: 'user', text: message },
        { type: 'bot', text: data.reply },
      ]);

      setMessage('');
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <>
      {/* Chat Icon */}
      {!isOpen && (
        <div className="position-fixed bottom-0 end-0 p-3">
          <Button variant="primary" onClick={() => setIsOpen(true)}>
            💬
          </Button>
        </div>
      )}

      {/* Chat Box Modal */}
      <Modal show={isOpen} onHide={() => setIsOpen(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Munchies AI</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="chat-box" style={{ maxHeight: '400px', overflowY: 'auto' }}>
            {Array.isArray(chat) && chat.map((msg, index) => (
              <div key={index} className={`mb-2 ${msg.type === 'bot' ? 'text-bold' : 'text-italic'}`}>
                {msg.type === 'bot' ? (
                  <ReactMarkdown>{msg.text}</ReactMarkdown>
                ) : (
                  <span>{msg.text}</span>
                )}
              </div>
            ))}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Form onSubmit={handleSubmit} className="d-flex w-100">
            <Form.Control
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              className="me-2"
            />
            <Button type="submit" variant="primary">Send</Button>
          </Form>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Chat;

