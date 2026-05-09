import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { Form, Input, Button, message, Alert } from 'antd';
import { MailOutlined, LockOutlined } from '@ant-design/icons';
import { setCurrentUser } from '../../loginSlice';

const StyledImage = styled.img`
  width: 55vw;
  height: 100vh;
  object-fit: cover;
  transition: all 0.5s ease-in-out;
  border-radius: 0 24px 24px 0;

  @media (max-width: 768px) {
    display: none;
  }
`;

const Wrapper = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  background: var(--bg-page);
  overflow: hidden;

  @media (max-width: 768px) {
    flex-direction: column;
    height: auto;
    min-height: 100vh;
    justify-content: center;
  }
`;

const LoginWrapper = styled.div`
  width: 45vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 2.5rem;
  background: var(--bg-page);

  @media (max-width: 768px) {
    width: 100%;
    padding: 1.5rem;
    min-height: 100vh;
  }
`;

const Title = styled.h1`
  color: var(--text-1);
  margin: 0;
  padding: 0;
  font-size: 2.5rem;
  font-family: 'Outfit', sans-serif;
  font-weight: 700;
  letter-spacing: -0.02em;
  text-align: center;
`;

const SubTitle = styled.h2`
  margin: 0.5rem 0 2.5rem 0;
  color: var(--text-3);
  font-size: 1rem;
  font-weight: 400;
  letter-spacing: 0.08em;
  text-align: center;
`;

const Card = styled.div`
  background: var(--surface);
  padding: 2.5rem;
  border-radius: var(--radius-l);
  box-shadow: var(--shadow-raised);
  border: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 85%;
  max-width: 420px;

  @media (max-width: 768px) {
    width: 100%;
    max-width: 420px;
    padding: 2rem 1.5rem;
  }
`;

const BrandIcon = styled.div`
  width: 64px;
  height: 64px;
  background: var(--brand-green);
  border-radius: 16px;
  margin-bottom: 1.75rem;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-size: 1.25rem;
  font-weight: 700;
  box-shadow: 0 4px 14px rgba(22, 163, 74, 0.35);
`;

const SubmitBtn = styled(Button)`
  width: 100%;
  height: 44px;
  border-radius: 999px !important;
  font-weight: 600;
  font-size: 0.95rem;
  background: var(--brand-green) !important;
  border-color: var(--brand-green) !important;
  color: #fff !important;
  margin-top: 0.5rem;

  &:hover {
    opacity: 0.9;
  }
`;

const LoginContainer = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (values) => {
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email: values.email, password: values.password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Login failed');
        return;
      }
      dispatch(setCurrentUser(data));
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Wrapper>
      <StyledImage
        src="https://res.cloudinary.com/dkftvbtmf/image/upload/v1774154648/samples/waves.png"
        alt="Lab environment"
      />
      <LoginWrapper>
        <Title>EPPL Inventory</Title>
        <SubTitle>precision • efficiency • control</SubTitle>
        <Card>
          <BrandIcon>EPPL</BrandIcon>
          {error && (
            <Alert
              message={error}
              type="error"
              showIcon
              style={{ width: '100%', marginBottom: '1rem' }}
            />
          )}
          <Form
            layout="vertical"
            onFinish={handleLogin}
            style={{ width: '100%' }}
            requiredMark={false}
          >
            <Form.Item
              name="email"
              rules={[{ required: true, message: 'Please enter your email' }]}
            >
              <Input
                prefix={<MailOutlined style={{ color: 'var(--text-3)' }} />}
                placeholder="Email address"
                size="large"
                type="email"
                autoComplete="email"
              />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[{ required: true, message: 'Please enter your password' }]}
            >
              <Input.Password
                prefix={<LockOutlined style={{ color: 'var(--text-3)' }} />}
                placeholder="Password"
                size="large"
                autoComplete="current-password"
              />
            </Form.Item>
            <Form.Item style={{ marginBottom: 0 }}>
              <SubmitBtn type="primary" htmlType="submit" loading={loading}>
                Sign In
              </SubmitBtn>
            </Form.Item>
          </Form>
        </Card>
      </LoginWrapper>
    </Wrapper>
  );
};

export default LoginContainer;
