import React, { useState, useEffect } from 'react';
import { Spin } from 'antd';
import styled from 'styled-components';
import StyledCard from './StyledCard.jsx';
import DeleteModal from '../Modals/DeleteModal.jsx';
import UpdateItem from '../Modals/UpdateItem.jsx';
import SearchInvalid from './SearchInvalid.jsx';
import { useSelector } from 'react-redux';

import { useGetItemsQuery, useGetItemsBySupplierQuery } from '../../services/items.js';

const StyledSpin = styled(Spin)`
  margin: 2rem;
`;

const GenericItemsList = ({ category, supplier }) => {
  const categoryResult = useGetItemsQuery(category, { skip: !category });
  const supplierResult = useGetItemsBySupplierQuery(supplier, { skip: !supplier });

  const activeResult = category ? categoryResult : supplierResult;
  const { data, error, isLoading, isSuccess, isError } = activeResult;

  const searchInput = useSelector((state) => state.filter.filter);
  const [foundItems, setFoundItems] = useState(null);

  useEffect(() => {
    if (data) {
      if (searchInput) {
        setFoundItems(
          data.filter((item) =>
            item.name.toLowerCase().startsWith(searchInput.toLowerCase())
          )
        );
      } else {
        setFoundItems(data);
      }
    }
  }, [data, searchInput]);

  const displayItems = foundItems || data || [];

  return (
    <div
      className="site-card-border-less-wrapper"
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: '1rem',
        padding: '1rem',
      }}>
      {isLoading && <StyledSpin />}
      {isError && (
        <div style={{ padding: '2rem', color: '#cf1322' }}>
          Error loading items: {error?.message || 'Unknown error'}
        </div>
      )}
      {isSuccess && displayItems.length === 0 && (
        <SearchInvalid />
      )}
      {isSuccess &&
        displayItems.map((item) => {
          const isLow = item.quantity < (item.minStock || 5);
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
              {supplier && (
                <p>
                  <b>Category:</b> {item.category}
                </p>
              )}
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
              {item.species && (
                <p>
                  <b>Species:</b> {item.species}
                </p>
              )}
              {item.lastFreeze && (
                <p>
                  <b>Last Freeze:</b> {item.lastFreeze}
                </p>
              )}
              {item.location && (
                <p>
                  <b>Location:</b> {item.location}
                </p>
              )}
              <div style={{ display: 'flex' }}>
                <UpdateItem id={item._id} category={item.category} />
                <DeleteModal
                  name={item.name}
                  id={item._id}
                  category={item.category}
                />
              </div>
            </StyledCard>
          );
        })}
    </div>
  );
};

export default GenericItemsList;
