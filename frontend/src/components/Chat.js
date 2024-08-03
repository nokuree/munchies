import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Button, Form, Modal, Spinner } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure Bootstrap CSS is imported
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import './Chat.css';

// Chatgpt ui stuff
function Chat({ restaurants }) {
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false); // State for loading indicator
  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
  useEffect(() => {
    // Add a default message when the component mounts
    const loadDefaultMessage = async () => {
      setChat([
        { type: 'bot', text: 'Hello! I am Brongo, your helpful assistant for finding the best restaurants around. How can I help you today?' }
      ]);
    };
 
    loadDefaultMessage();
  }, []); // Empty dependency array ensures this runs only once when the component mounts

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Add the user's message to the chat
    setChat((prevChat) => [
      ...prevChat,
      { type: 'user', text: message },
      { type: 'bot', text: 'Loading...', loading: true }, // Add a loading message
    ]);
    setMessage('');
    setLoading(true); // Set loading state to true

    try {
      const response = await fetch(`${apiBaseUrl}/chat/`, {
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

      // Update chat with bot's response
      setChat((prevChat) => {
        const newChat = [...prevChat];
        newChat[newChat.length - 1] = { type: 'bot', text: data.reply }; // Replace loading message with actual response
        return newChat;
      });

      setLoading(false); // Set loading state to false
    } catch (error) {
      console.error("Error sending message:", error);
      // Handle error appropriately (e.g., show an error message)
      setLoading(false); // Set loading state to false even if there's an error
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
        <Modal.Header
          closeButton
          style={{
            backgroundColor: '#333',
            color: '#fff',
          }}
        >
          <Modal.Title>Munchies AI</Modal.Title>
        </Modal.Header>
        <Modal.Body
          style={{
            backgroundColor: '#333',
            color: '#fff',
          }}
        >
          <div
            className="chat-box"
            style={{
              maxHeight: '400px',
              overflowY: 'auto',
              backgroundColor: '#444',
              padding: '10px'
            }}
          >
            <TransitionGroup>
              {Array.isArray(chat) && chat.map((msg, index) => (
                <CSSTransition
                  key={index}
                  timeout={300}
                  classNames="message"
                >
                  <div
                    style={{
                      padding: '10px',
                      marginBottom: '5px',
                      borderRadius: '5px',
                      color: '#fff',
                      backgroundColor: msg.type === 'bot' ? '#555' : '#666',
                    }}
                  >
                    <div
                      style={{
                        fontWeight: 'bold',
                        marginBottom: '5px',
                      }}
                    >
                      {msg.type === 'bot' ? 'Brongo' : 'User'}:
                    </div>
                    {msg.loading ? (
                      <Spinner animation="border" role="status" size="sm" />
                    ) : (
                      msg.type === 'bot' ? (
                        <ReactMarkdown>{msg.text}</ReactMarkdown>
                      ) : (
                        <span>{msg.text}</span>
                      )
                    )}
                  </div>
                </CSSTransition>
              ))}
            </TransitionGroup>
          </div>
        </Modal.Body>
        <Modal.Footer
          style={{
            backgroundColor: '#333',
          }}
        >
          <Form onSubmit={handleSubmit} className="d-flex w-100">
            <Form.Control
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              className="me-2"
              style={{
                backgroundColor: '#fff',
                color: '#333',
              }}
            />
            <Button type="submit" variant="primary">Send</Button>
          </Form>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Chat;

