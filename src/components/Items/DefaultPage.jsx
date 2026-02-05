import React from 'react';
import styled from 'styled-components';

const Image = styled.img`
  width: 14rem;
  margin: 2.5rem 0;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 75vh;
  font-family: 'Outfit', sans-serif;
`;

const MainText = styled.p`
  color: #e6edf7;
  /* margin-top: 0.5rem; */
  margin-bottom: 0;
  font-size: 1.5rem;
  /* line-height: 0.5rem; */
`;
const SubText = styled.p`
  color: #a8b3cf;
  font-size: 1rem;
`;

const DefaultPage = () => {
  return (
    <Wrapper>
      <Image src="https://cdn-icons-png.flaticon.com/512/6552/6552495.png" />
      <MainText>welcome to EPPL inventory</MainText>
      <SubText>click on the side navigation to begin</SubText>
    </Wrapper>
  );
};

export default DefaultPage;
