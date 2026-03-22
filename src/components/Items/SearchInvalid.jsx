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
  color: var(--text-1, #1a1a1a);
  margin-bottom: 0;
  font-size: 1.5rem;
`;
const SubText = styled.p`
  color: var(--text-2, #6b7280);
  font-size: 1rem;
`;

const SearchInvalid = (props) => {
  return (
    <Wrapper onClick={props.filter}>
      <Image src="https://cdn-icons-png.flaticon.com/512/2855/2855060.png" />
      <MainText>Oops!</MainText>
      <SubText>No items match your search</SubText>
      {/* <button onClick={props.filter}>search again</button> */}
    </Wrapper>
  );
};

export default SearchInvalid;
