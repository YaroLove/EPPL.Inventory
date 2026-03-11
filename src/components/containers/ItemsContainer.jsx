import React from 'react';
import styled from 'styled-components';
import { Affix, Spin } from 'antd';

import 'antd/dist/antd.css';
import { SearchBar } from '../Items/SearchBar.jsx';
import AddItem from '../Modals/AddItem.jsx';
import MedCartList from '../Items/MedCartList.jsx';
import PowerLabList from '../Items/PowerLabList.jsx';
import PhysioflowList from '../Items/PhysioflowList.jsx';
import BloodworkList from '../Items/BloodworkList.jsx';

import { useSelector } from 'react-redux';
import DefaultPage from '../Items/DefaultPage.jsx';
import TechnicalChallenges from '../Items/TechnicalChallenges.jsx';
import Dashboard from '../Dashboard/Dashboard.jsx';
// import { useGetMedCartQuery } from '../../services/items.js';

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
          <AddItem></AddItem>
          <SearchBar></SearchBar>
        </div>
      </Affix>
      {display === 'default' && <DefaultPage></DefaultPage>}
      {display === 'dashboard' && <Dashboard />}
      {display === 'MedCart' && (
        <MedCartList data={undefined}></MedCartList>
      )}
      {display === 'PowerLab' && <PowerLabList data={undefined}></PowerLabList>}
      {display === 'Physioflow' && <PhysioflowList data={undefined}></PhysioflowList>}
      {display === 'Bloodwork' && (
        <BloodworkList data={undefined}></BloodworkList>
      )}
      {display === 'favorites' && <TechnicalChallenges></TechnicalChallenges>}
    </Wrapper>
  );
};

export default ItemsContainer;
