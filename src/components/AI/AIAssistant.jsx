import React, { useState, useRef, useEffect } from 'react';
import { Input, Spin } from 'antd';
import {
  MessageOutlined,
  CloseOutlined,
  SendOutlined,
  RobotOutlined,
} from '@ant-design/icons';
import styled, { keyframes } from 'styled-components';
import { useAskAIMutation, useGetSuggestionsQuery } from '../../services/ai';

const slideUp = keyframes`
  from { opacity: 0; transform: translateY(16px) scale(0.97); }
  to   { opacity: 1; transform: translateY(0)    scale(1);    }
`;

const FloatingContainer = styled.div`
  position: fixed;
  bottom: 1.5rem;
  right: 1.5rem;
  z-index: 1000;

  @media (max-width: 640px) {
    bottom: 1rem;
    right: 1rem;
  }
`;

const ChatWindow = styled.div`
  width: 380px;
  height: 540px;
  display: flex;
  flex-direction: column;
  position: absolute;
  bottom: 64px;
  right: 0;
  background: #ffffff;
  border: 1px solid var(--border, #e5e7eb);
  border-radius: var(--radius-l, 16px);
  box-shadow: 0 12px 48px rgba(0, 0, 0, 0.12), 0 4px 16px rgba(0, 0, 0, 0.06);
  overflow: hidden;
  animation: ${slideUp} 0.25s ease-out;

  @media (max-width: 640px) {
    width: calc(100vw - 2rem);
    height: 70vh;
    right: 0;
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  border-bottom: 1px solid var(--border, #e5e7eb);
  background: var(--brand-green, #16a34a);
  color: #ffffff;
  flex-shrink: 0;
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 600;
  font-size: 0.95rem;
`;

const AvatarCircle = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
`;

const CloseBtn = styled.button`
  background: rgba(255, 255, 255, 0.15);
  border: none;
  border-radius: 50%;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #ffffff;
  transition: background 0.15s;

  &:hover { background: rgba(255, 255, 255, 0.25); }
`;

const MessagesArea = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;

  &::-webkit-scrollbar { width: 4px; }
  &::-webkit-scrollbar-track { background: transparent; }
  &::-webkit-scrollbar-thumb {
    background: #d1d5db;
    border-radius: 4px;
  }
`;

const MessageRow = styled.div`
  display: flex;
  justify-content: ${p => (p.$isUser ? 'flex-end' : 'flex-start')};
`;

const Bubble = styled.div`
  max-width: 82%;
  padding: 10px 14px;
  border-radius: 14px;
  font-size: 0.875rem;
  line-height: 1.5;
  white-space: pre-wrap;
  word-break: break-word;

  ${p =>
    p.$isUser
      ? `
    background: var(--brand-green, #16a34a);
    color: #ffffff;
    border-bottom-right-radius: 4px;
  `
      : `
    background: #f3f4f6;
    color: var(--text-1, #111827);
    border-bottom-left-radius: 4px;
  `}
`;

const SuggestionsWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 4px 0;
`;

const SuggestionChip = styled.button`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 10px 12px;
  background: #ffffff;
  border: 1px solid var(--border, #e5e7eb);
  border-radius: 12px;
  cursor: pointer;
  text-align: left;
  transition: all 0.15s;

  &:hover {
    border-color: var(--brand-green, #16a34a);
    background: var(--brand-green-light, #dcfce7);
  }
`;

const ChipIcon = styled.span`
  font-size: 1.15rem;
  flex-shrink: 0;
  margin-top: 1px;
`;

const ChipText = styled.div`
  font-size: 0.82rem;
  font-weight: 500;
  color: var(--text-1, #111827);
  line-height: 1.35;
`;

const ChipSub = styled.div`
  font-size: 0.75rem;
  font-weight: 400;
  color: var(--text-2, #4b5563);
  margin-top: 2px;
`;

const InputArea = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 14px;
  border-top: 1px solid var(--border, #e5e7eb);
  background: #fafafa;
  flex-shrink: 0;
`;

const StyledInput = styled(Input)`
  && {
    border-radius: 999px !important;
    background: #ffffff !important;
    border: 1px solid var(--border, #e5e7eb) !important;
    padding: 8px 14px !important;
    font-size: 0.875rem !important;

    &:focus, &.ant-input-focused {
      border-color: var(--brand-green, #16a34a) !important;
      box-shadow: 0 0 0 2px rgba(22, 163, 74, 0.1) !important;
    }
  }
`;

const SendBtn = styled.button`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: none;
  background: var(--brand-green, #16a34a);
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;
  transition: background 0.15s, transform 0.1s;
  font-size: 15px;

  &:hover { background: #15803d; }
  &:active { transform: scale(0.94); }
  &:disabled {
    background: #d1d5db;
    cursor: default;
  }
`;

const ToggleBtn = styled.button`
  width: 52px;
  height: 52px;
  border-radius: 50%;
  border: none;
  background: var(--brand-green, #16a34a);
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 22px;
  box-shadow: 0 4px 16px rgba(22, 163, 74, 0.3);
  transition: background 0.15s, transform 0.1s, box-shadow 0.15s;

  &:hover {
    background: #15803d;
    box-shadow: 0 6px 24px rgba(22, 163, 74, 0.4);
    transform: scale(1.05);
  }
  &:active { transform: scale(0.96); }
`;

const TypingDots = styled.div`
  display: flex;
  gap: 4px;
  padding: 6px 0;
  align-self: flex-start;

  span {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: #9ca3af;
    animation: bounce 1.2s infinite;
  }
  span:nth-child(2) { animation-delay: 0.15s; }
  span:nth-child(3) { animation-delay: 0.3s; }

  @keyframes bounce {
    0%, 60%, 100% { transform: translateY(0); }
    30% { transform: translateY(-6px); }
  }
`;

const WELCOME_MESSAGE = "Hi! I'm your Lab Inventory AI. I can help you manage stock, look up product info from manufacturers, and update item details. Try one of these:";

const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { role: 'assistant', content: WELCOME_MESSAGE },
  ]);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const [askAI, { isLoading }] = useAskAIMutation();
  const { data: suggestionsData } = useGetSuggestionsQuery(undefined, { skip: !isOpen });
  const suggestions = suggestionsData?.suggestions || [
    { icon: '📦', text: 'What items are running low and need reordering?', description: 'Check stock levels' },
    { icon: '🔍', text: 'Look up product pricing and availability', description: 'Search manufacturer websites' },
    { icon: '✏️', text: 'Help me add missing details to inventory items', description: 'AI fills in product specs' },
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  const buildHistory = () =>
    messages
      .filter(m => m.role === 'user' || m.role === 'assistant')
      .slice(1)
      .map(m => ({ role: m.role, content: m.content }));

  const sendMessage = async (text) => {
    if (!text.trim()) return;
    const userMsg = text.trim();

    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setInput('');
    setShowSuggestions(false);

    try {
      const history = buildHistory();
      const result = await askAI({ question: userMsg, history }).unwrap();
      setMessages(prev => [...prev, { role: 'assistant', content: result.answer }]);
    } catch (err) {
      const errMsg = err?.data?.error || 'Sorry, something went wrong. Please try again.';
      setMessages(prev => [...prev, { role: 'assistant', content: errMsg }]);
    }
  };

  const handleSend = () => sendMessage(input);
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <FloatingContainer>
      {isOpen && (
        <ChatWindow>
          <Header>
            <HeaderLeft>
              <AvatarCircle><RobotOutlined /></AvatarCircle>
              Lab Inventory AI
            </HeaderLeft>
            <CloseBtn onClick={() => setIsOpen(false)}>
              <CloseOutlined style={{ fontSize: 12 }} />
            </CloseBtn>
          </Header>

          <MessagesArea>
            {messages.map((msg, idx) => (
              <MessageRow key={idx} $isUser={msg.role === 'user'}>
                <Bubble $isUser={msg.role === 'user'}>{msg.content}</Bubble>
              </MessageRow>
            ))}

            {showSuggestions && (
              <SuggestionsWrap>
                {suggestions.map((s, idx) => (
                  <SuggestionChip key={idx} onClick={() => sendMessage(s.text)}>
                    <ChipIcon>{s.icon}</ChipIcon>
                    <div>
                      <ChipText>{s.text}</ChipText>
                      <ChipSub>{s.description}</ChipSub>
                    </div>
                  </SuggestionChip>
                ))}
              </SuggestionsWrap>
            )}

            {isLoading && (
              <TypingDots>
                <span /><span /><span />
              </TypingDots>
            )}
            <div ref={messagesEndRef} />
          </MessagesArea>

          <InputArea>
            <StyledInput
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask a question..."
              disabled={isLoading}
            />
            <SendBtn onClick={handleSend} disabled={isLoading || !input.trim()}>
              {isLoading ? <Spin size="small" /> : <SendOutlined />}
            </SendBtn>
          </InputArea>
        </ChatWindow>
      )}

      <ToggleBtn onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <CloseOutlined /> : <MessageOutlined />}
      </ToggleBtn>
    </FloatingContainer>
  );
};

export default AIAssistant;
