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
  align-items: stretch;
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
            backgroundColor: '#ffffff',
            width: '100%',
            justifyContent: 'flex-start',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '0.75rem',
            padding: '0.75rem 1rem',
            borderRadius: '14px',
            border: '1px solid var(--border)',
            boxShadow: 'var(--shadow-card)',
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
