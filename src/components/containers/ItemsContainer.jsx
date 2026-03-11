import React from 'react';
import styled from 'styled-components';
import { Affix } from 'antd';

import 'antd/dist/antd.css';
import { SearchBar } from '../Items/SearchBar.jsx';
import AddItem from '../Modals/AddItem.jsx';
import GenericItemsList from '../Items/GenericItemsList.jsx';

import { useSelector } from 'react-redux';
import DefaultPage from '../Items/DefaultPage.jsx';
import TechnicalChallenges from '../Items/TechnicalChallenges.jsx';
import Dashboard from '../Dashboard/Dashboard.jsx';

const Wrapper = styled.div`
  width: 100%;
  max-width: 1400px;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.25rem;
`;

const ItemsContainer = () => {
  const display = useSelector((state) => state.display.display);

  const displayType = display?.type || 'page';
  const displayValue = display?.value || display;

  return (
    <Wrapper>
      <Affix offsetTop={0}>
        <div
          style={{
            display: 'flex',
            backgroundColor: 'rgba(255, 255, 255, 0.06)',
            width: '100%',
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: '1rem',
            padding: '0.75rem',
            borderRadius: '18px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            backdropFilter: 'blur(12px)',
          }}>
          <AddItem />
          <SearchBar />
        </div>
      </Affix>
      {displayType === 'page' && displayValue === 'default' && <DefaultPage />}
      {displayType === 'page' && displayValue === 'dashboard' && <Dashboard />}
      {displayType === 'page' && displayValue === 'favorites' && <TechnicalChallenges />}
      {displayType === 'category' && (
        <GenericItemsList key={`cat-${displayValue}`} category={displayValue} />
      )}
      {displayType === 'supplier' && (
        <GenericItemsList key={`sup-${displayValue}`} supplier={displayValue} />
      )}
    </Wrapper>
  );
};

export default ItemsContainer;
