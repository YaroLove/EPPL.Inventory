import React, { useState } from 'react';
import { Button, Input, List, Card, Spin } from 'antd';
import { MessageOutlined, CloseOutlined, SendOutlined, RobotOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { useAskAIMutation } from '../../services/ai';

const FloatingContainer = styled.div`
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  z-index: 1000;

  @media (max-width: 640px) {
    bottom: 1rem;
    right: 1rem;
  }
`;

const ChatWindow = styled(Card)`
  width: 360px;
  height: 520px;
  display: flex;
  flex-direction: column;
  position: absolute;
  bottom: 60px;
  right: 0;
  background: rgba(15, 23, 42, 0.95) !important;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
  box-shadow: 0 30px 60px rgba(2, 8, 23, 0.5);
  
  .ant-card-body {
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: 12px;
  }

  @media (max-width: 640px) {
    width: 90vw;
    height: 70vh;
    right: 0;
  }
`;

const MessageList = styled.div`
  flex-grow: 1;
  overflow-y: auto;
  margin-bottom: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const MessageBubble = styled.div`
  background: ${props =>
    props.isUser ? 'linear-gradient(135deg, #6aa9ff, #59c2ff)' : 'rgba(255, 255, 255, 0.08)'};
  color: ${props => (props.isUser ? 'white' : '#e6edf7')};
  padding: 8px 12px;
  border-radius: 12px;
  max-width: 80%;
  align-self: ${props => props.isUser ? 'flex-end' : 'flex-start'};
  white-space: pre-wrap;
`;

const AIAssistant = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState('');
    const [history, setHistory] = useState([{ role: 'system', content: 'Hello! I am your inventory assistant. Ask me anything about your stock.' }]);

    const [askAI, { isLoading }] = useAskAIMutation();

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg = input;
        setHistory(prev => [...prev, { role: 'user', content: userMsg }]);
        setInput('');

        try {
            const result = await askAI(userMsg).unwrap();
            setHistory(prev => [...prev, { role: 'system', content: result.answer }]);
        } catch (err) {
            setHistory(prev => [...prev, { role: 'system', content: 'Sorry, I encountered an error. Please try again.' }]);
        }
    };

    return (
        <FloatingContainer>
            {isOpen && (
                <ChatWindow title={<span><RobotOutlined /> Inventory AI</span>} extra={<Button type="text" icon={<CloseOutlined />} onClick={() => setIsOpen(false)} />}>
                    <MessageList>
                        {history.map((msg, idx) => (
                            <MessageBubble key={idx} isUser={msg.role === 'user'}>
                                {msg.content}
                            </MessageBubble>
                        ))}
                        {isLoading && <Spin size="small" style={{ alignSelf: 'flex-start', marginLeft: '10px' }} />}
                    </MessageList>
                    <div style={{ display: 'flex' }}>
                        <Input
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onPressEnter={handleSend}
                            placeholder="Ask a question..."
                        />
                        <Button type="primary" icon={<SendOutlined />} onClick={handleSend} loading={isLoading} />
                    </div>
                </ChatWindow>
            )}
            <Button
                type="primary"
                shape="circle"
                icon={<MessageOutlined />}
                size="large"
                style={{
                    width: '52px',
                    height: '52px',
                    boxShadow: '0 15px 30px rgba(89, 194, 255, 0.3)',
                    border: 'none',
                }}
                onClick={() => setIsOpen(!isOpen)}
            />
        </FloatingContainer>
    );
};

export default AIAssistant;
