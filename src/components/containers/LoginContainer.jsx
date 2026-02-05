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

  @media (max-width: 900px) {
    width: 100%;
    height: 40vh;
  }
`;

const Wrapper = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  background: linear-gradient(135deg, #00213f 0%, #001020 100%);
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
  padding: 2rem;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-left: 1px solid rgba(255, 255, 255, 0.1);

  @media (max-width: 900px) {
    width: 100%;
    border-left: none;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
  }
`;

const Title = styled.h1`
  color: #ffffff;
  margin: 0;
  padding: 0;
  font-size: 3.5rem;
  font-family: 'MuseoModerno', cursive;
  font-weight: 600;
  letter-spacing: 0.1rem;
  text-align: center;
  text-shadow: 0 4px 10px rgba(0,0,0,0.3);
`;

const SubTitle = styled.h2`
  margin: 0.5rem 0 2.5rem 0;
  color: #afb9dd;
  font-size: 1.2rem;
  font-family: 'Archivo', sans-serif;
  font-weight: 300;
  letter-spacing: 0.05rem;
  opacity: 0.8;
`;

const Card = styled.div`
  background: rgba(255, 255, 255, 0.95);
  padding: 3rem;
  border-radius: 24px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.4);
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 80%;
  max-width: 400px;

  @media (max-width: 900px) {
    width: 100%;
    max-width: 420px;
  }
`;

const BrandIcon = styled.div`
  width: 70px;
  height: 70px;
  background: #951717;
  border-radius: 12px;
  margin-bottom: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-size: 1.5rem;
  font-weight: bold;
`;

const GuestLoginBtn = styled(Button)`
  width: 100%;
  height: 45px;
  margin-top: 1.5rem;
  border-radius: 8px;
  font-weight: 500;
  border: 1px solid #951717;
  
  &:hover {
    color: #951717;
    border-color: #951717;
  }
`;

const StyledP = styled.p`
  color: #000000;
  margin: 1.5rem 0;
  font-family: 'Archivo', sans-serif;
  font-size: 0.9rem;
  position: relative;
  width: 100%;
  text-align: center;

  &:before, &:after {
    content: '';
    position: absolute;
    top: 50%;
    width: 35%;
    height: 1px;
    background: #951717;
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
