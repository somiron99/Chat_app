import React, { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import styled, { createGlobalStyle } from 'styled-components';

const SOCKET_URL = 'http://localhost:5000';

const GlobalStyle = createGlobalStyle`
  body {
    background: #f4f7fa;
    font-family: 'Segoe UI', 'Roboto', 'Arial', sans-serif;
    margin: 0;
    padding: 0;
  }
`;

const Centered = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 100px;
`;

const Card = styled.div`
  max-width: 480px;
  width: 100%;
  background: #fff;
  margin: 40px auto;
  padding: 32px 24px 24px 24px;
  border-radius: 18px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.08);
`;

const Title = styled.h2`
  margin: 0 0 16px 0;
  font-size: 2rem;
  color: #2d3748;
`;

const Input = styled.input`
  padding: 10px 14px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 1rem;
  margin-bottom: 12px;
  width: 100%;
  box-sizing: border-box;
  &:focus {
    outline: none;
    border-color: #3182ce;
  }
`;

const Button = styled.button`
  background: #3182ce;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 10px 22px;
  font-size: 1rem;
  cursor: pointer;
  margin-left: 8px;
  transition: background 0.2s;
  &:hover {
    background: #2563eb;
  }
`;

const ErrorMsg = styled.div`
  color: #e53e3e;
  margin-top: 8px;
`;

const RoomCode = styled.div`
  margin-bottom: 16px;
  font-size: 1rem;
  color: #4a5568;
  b {
    color: #2b6cb0;
  }
`;

const ChatArea = styled.div`
  height: 340px;
  overflow-y: auto;
  background: #f7fafc;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
  margin-bottom: 18px;
  padding: 18px 12px 8px 12px;
  display: flex;
  flex-direction: column;
`;

const MessageBubble = styled.div`
  align-self: ${props => props.own ? 'flex-end' : 'flex-start'};
  background: ${props => props.own ? '#3182ce' : '#e2e8f0'};
  color: ${props => props.own ? '#fff' : '#2d3748'};
  padding: 10px 16px;
  border-radius: 16px;
  margin: 6px 0;
  max-width: 70%;
  word-break: break-word;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  position: relative;
`;

const MessageMeta = styled.div`
  font-size: 0.85rem;
  color: #718096;
  margin-bottom: 2px;
`;

const FilePreview = styled.div`
  margin-top: 8px;
  img, video {
    max-width: 180px;
    max-height: 180px;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  }
`;

const ChatForm = styled.form`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const FileInput = styled.input`
  width: 140px;
`;

function App() {
  const [step, setStep] = useState('username'); // 'username', 'room', 'chat'
  const [username, setUsername] = useState('');
  const [roomName, setRoomName] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [joinCode, setJoinCode] = useState('');
  const [error, setError] = useState('');
  const [createdRoomCode, setCreatedRoomCode] = useState('');
  const [file, setFile] = useState(null);
  const socketRef = useRef();
  const chatAreaRef = useRef();

  // Connect/disconnect socket on roomCode change
  useEffect(() => {
    if (step !== 'chat' || !roomCode) return;
    socketRef.current = io(SOCKET_URL);
    socketRef.current.emit('join room', { roomCode, username });
    socketRef.current.on('chat message', (msg) => {
      setMessages(prev => [...prev, msg]);
    });
    return () => {
      socketRef.current.disconnect();
    };
  }, [roomCode, step, username]);

  // Fetch messages for the room (optional: you can scope messages by room in backend for more security)
  useEffect(() => {
    if (step !== 'chat' || !roomCode) return;
    fetch(`${SOCKET_URL}/api/messages`)
      .then(res => res.json())
      .then(data => setMessages(data.filter(m => m.roomCode === roomCode || !m.roomCode)));
  }, [roomCode, step]);

  useEffect(() => {
    if (chatAreaRef.current) {
      chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleCreateRoom = async () => {
    setError('');
    if (!roomName.trim()) return setError('Room name required');
    try {
      const res = await fetch(`${SOCKET_URL}/api/rooms/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: roomName, username })
      });
      const data = await res.json();
      if (res.ok) {
        setRoomCode(data.code);
        setCreatedRoomCode(data.code);
        setStep('chat');
      } else {
        setError(data.error || 'Failed to create room');
      }
    } catch (e) {
      setError('Server error');
    }
  };

  const handleJoinRoom = async () => {
    setError('');
    if (!joinCode.trim()) return setError('Room code required');
    try {
      const res = await fetch(`${SOCKET_URL}/api/rooms/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: joinCode.trim().toUpperCase(), username })
      });
      const data = await res.json();
      if (res.ok) {
        setRoomCode(data.code);
        setStep('chat');
      } else {
        setError(data.error || 'Failed to join room');
      }
    } catch (e) {
      setError('Server error');
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if ((!input.trim() && !file) || !username.trim() || !roomCode) return;
    let fileUrl = null;
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch(`${SOCKET_URL}/api/upload`, {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      fileUrl = data.url;
      setFile(null);
    }
    const msgObj = { username, message: input, roomCode, fileUrl };
    await fetch(`${SOCKET_URL}/api/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(msgObj)
    });
    socketRef.current.emit('chat message', msgObj);
    setInput('');
  };

  // Step 1: Username
  if (step === 'username') {
    return (
      <>
        <GlobalStyle />
        <Centered>
          <Card>
            <Title>Enter your username</Title>
            <Input value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" />
            <Button onClick={() => username.trim() && setStep('room')}>Continue</Button>
          </Card>
        </Centered>
      </>
    );
  }

  // Step 2: Room selection
  if (step === 'room') {
    return (
      <>
        <GlobalStyle />
        <Centered>
          <Card>
            <Title>Create a Room</Title>
            <Input value={roomName} onChange={e => setRoomName(e.target.value)} placeholder="Room name" />
            <Button onClick={handleCreateRoom}>Create</Button>
            <div style={{ margin: '18px 0', color: '#888' }}>or</div>
            <Title style={{ fontSize: '1.3rem', margin: 0 }}>Join a Room</Title>
            <Input value={joinCode} onChange={e => setJoinCode(e.target.value)} placeholder="Room code" />
            <Button onClick={handleJoinRoom}>Join</Button>
            {error && <ErrorMsg>{error}</ErrorMsg>}
          </Card>
        </Centered>
      </>
    );
  }

  // Step 3: Chat UI
  return (
    <>
      <GlobalStyle />
      <Card>
        <Title>MERN Chat App</Title>
        <RoomCode>
          <b>Room code:</b> {roomCode} {createdRoomCode && <span style={{ color: 'green' }}>(Share this code!)</span>}
        </RoomCode>
        <ChatArea ref={chatAreaRef}>
          {messages.map((msg, idx) => (
            <MessageBubble key={idx} own={msg.username === username}>
              <MessageMeta>{msg.username}</MessageMeta>
              {msg.message && <span>{msg.message}</span>}
              {msg.fileUrl && (
                <FilePreview>
                  {msg.fileUrl.match(/\.(mp4|webm|ogg)$/i)
                    ? <video src={`http://localhost:5000${msg.fileUrl}`} controls />
                    : <img src={`http://localhost:5000${msg.fileUrl}`} alt="uploaded" />
                  }
                </FilePreview>
              )}
            </MessageBubble>
          ))}
        </ChatArea>
        <ChatForm onSubmit={sendMessage}>
          <Input
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Type a message..."
            style={{ flex: 1, marginBottom: 0 }}
          />
          <FileInput
            type="file"
            accept="image/*,video/*"
            onChange={e => setFile(e.target.files[0])}
          />
          <Button type="submit">Send</Button>
        </ChatForm>
      </Card>
    </>
  );
}

export default App; 