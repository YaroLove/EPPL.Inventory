import React, { useEffect, useState } from 'react';
import { Spin } from 'antd';
import styled from 'styled-components';
import StyledCard from './StyledCard.jsx';
import DeleteModal from '../Modals/DeleteModal.jsx';
import UpdateItem from '../Modals/UpdateItem.jsx';
import SearchInvalid from './SearchInvalid.jsx';
import { useSelector } from 'react-redux';

import { useGetEquipmentQuery } from '../../services/items';

const GridContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  padding: 1rem;
  gap: 1rem;
  width: 100%;
`;

const EquipmentList = () => {
  const { data, error, isLoading, isSuccess, isError } = useGetEquipmentQuery();
  const searchInput = useSelector((state) => state.filter.filter);
  const [foundItems, setFoundItems] = useState([]);

  useEffect(() => {
    if (data) {
      if (searchInput !== '') {
        const results = data.filter((item) =>
          item.name.toLowerCase().includes(searchInput.toLowerCase())
        );
        setFoundItems(results);
      } else {
        setFoundItems(data);
      }
    }
  }, [data, searchInput]);

  return (
    <div className="site-card-border-less-wrapper" style={{ width: '100%' }}>
      {isLoading && (
        <Spin size="large" style={{ display: 'block', margin: '3rem auto' }} />
      )}
      {isError && (
        <div style={{ padding: '2rem', color: '#cf1322' }}>
          Error loading equipment: {error?.message || 'Unknown error'}
        </div>
      )}
      {isSuccess && (
        <GridContainer>
          {foundItems.map((item) => {
            const minStock = item.minStock ?? 5;
            const isLow = item.quantity !== undefined && item.quantity <= minStock;
            const imageSrc = item.image
              ? item.image.startsWith('http') || item.image.startsWith('/uploads')
                ? item.image
                : `/uploads/${item.image}`
              : null;

            return (
              <StyledCard
                key={item._id}
                hoverable
                bordered={false}
                style={{
                  backgroundColor: isLow ? '#f8bdbd' : 'none',
                }}>
                {imageSrc && (
                  <img
                    src={imageSrc}
                    alt={item.name}
                    style={{
                      width: '100%',
                      height: '180px',
                      objectFit: 'cover',
                      borderRadius: '12px',
                      marginBottom: '0.75rem',
                    }}
                  />
                )}
                <h3>{item.name}</h3>
                <p>
                  <b>Supplier:</b> {item.supplier}
                </p>
                <p>
                  <b>Catalog No.:</b> {item.catalog}
                </p>
                <p>
                  <b>Description:</b> {item.description}
                </p>
                {item.quantity !== undefined && (
                  <p>
                    <b>Qty:</b> {item.quantity}
                  </p>
                )}
                {item.lastMaintenance && (
                  <p>
                    <b>Last maintenance:</b> {item.lastMaintenance}
                  </p>
                )}
                <div style={{ display: 'flex' }}>
                  <UpdateItem id={item._id} category="equipment"></UpdateItem>
                  <DeleteModal
                    name={item.name}
                    id={item._id}
                    category="equipment"></DeleteModal>
                </div>
              </StyledCard>
            );
          })}
          {foundItems.length === 0 && <SearchInvalid></SearchInvalid>}
        </GridContainer>
      )}
    </div>
  );
};

export default EquipmentList;
