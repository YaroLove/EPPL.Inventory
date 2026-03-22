import React from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { setLogin } from '../../loginSlice';
import { Button } from 'antd';
import LoginOAuth from './LoginOAuth.jsx';

const StyledImage = styled.img`
  width: 55vw;
  height: 100vh;
  object-fit: cover;
  transition: all 0.5s ease-in-out;
  border-radius: 0 24px 24px 0;

  @media (max-width: 900px) {
    width: 100%;
    height: 40vh;
    border-radius: 0 0 24px 24px;
  }
`;

const Wrapper = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  background: var(--bg-page);
  overflow: hidden;

  @media (max-width: 900px) {
    flex-direction: column;
    height: auto;
    min-height: 100vh;
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

  @media (max-width: 900px) {
    width: 100%;
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
  max-width: 400px;

  @media (max-width: 900px) {
    width: 100%;
    max-width: 420px;
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

const GuestLoginBtn = styled(Button)`
  width: 100%;
  height: 44px;
  margin-top: 1.25rem;
  border-radius: 999px !important;
  font-weight: 500;
  border: 1px solid var(--border) !important;
  color: var(--text-2) !important;
  background: var(--surface) !important;

  &:hover {
    border-color: var(--brand-green) !important;
    color: var(--brand-green) !important;
  }
`;

const StyledP = styled.p`
  color: var(--text-3);
  margin: 1.25rem 0;
  font-size: 0.85rem;
  position: relative;
  width: 100%;
  text-align: center;

  &:before, &:after {
    content: '';
    position: absolute;
    top: 50%;
    width: 35%;
    height: 1px;
    background: var(--border);
  }
  &:before { left: 0; }
  &:after { right: 0; }
`;

const LoginContainer = () => {
  const dispatch = useDispatch();

  const handleLogin = () => {
    dispatch(setLogin(true));
  };

  return (
    <Wrapper>
      <StyledImage src="https://6983befb32fdc2721e45d6ac.imgix.net/EPPL/Inventory/Main_Picture.jpg" alt="Lab environment" />
      <LoginWrapper>
        <Title>EPPL Inventory</Title>
        <SubTitle>precision • efficiency • control</SubTitle>
        <Card>
          <BrandIcon> EPPL </BrandIcon>
          <LoginOAuth />
          <StyledP>or</StyledP>
          <GuestLoginBtn onClick={handleLogin}>
            Sign In as a Guest
          </GuestLoginBtn>
        </Card>
      </LoginWrapper>
    </Wrapper>
  );
};

export default LoginContainer;
