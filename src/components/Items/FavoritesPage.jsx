import React, { useState } from 'react';
import { Spin, Empty } from 'antd';
import styled from 'styled-components';
import StyledCard from './StyledCard.jsx';
import DeleteModal from '../Modals/DeleteModal.jsx';
import UpdateItem from '../Modals/UpdateItem.jsx';
import ItemDetailModal from './ItemDetailModal.jsx';
import { HeartFilled } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { updateFavorites } from '../../loginSlice';
import { useGetFavoritesQuery, useRemoveFavoriteMutation } from '../../services/userApi';
import { combinedItemTitle, isLowStock } from '../../utils/itemFormUtils';

const StyledSpin = styled(Spin)`
  margin: 2rem;
`;

const PageHeader = styled.div`
  padding: 1.5rem 1rem 0.5rem;
  h2 {
    font-size: 1.4rem;
    font-weight: 700;
    color: var(--text-1);
    margin: 0;
  }
  p {
    color: var(--text-2);
    margin: 0.25rem 0 0;
    font-size: 0.875rem;
  }
`;

const FavoritesPage = () => {
  const dispatch = useDispatch();
  const favorites = useSelector((state) => state.login.favorites || []);
  const { data: items = [], isLoading, isError } = useGetFavoritesQuery();
  const [removeFavorite] = useRemoveFavoriteMutation();
  const [detailItem, setDetailItem] = useState(null);

  return (
    <div>
      <PageHeader>
        <h2>Favorites</h2>
        <p>{items.length} favorited item{items.length !== 1 ? 's' : ''}</p>
      </PageHeader>

      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '1rem',
          padding: '1rem',
        }}>
        {isLoading && <StyledSpin />}
        {isError && <p style={{ color: '#cf1322' }}>Error loading favorites.</p>}
        {!isLoading && !isError && items.length === 0 && (
          <Empty
            description="No favorites yet — click the heart icon on any item to save it here."
            style={{ margin: '3rem auto' }}
          />
        )}

        <ItemDetailModal
          item={detailItem}
          visible={!!detailItem}
          onClose={() => setDetailItem(null)}
        />

        {items.map((item) => {
          const isLow = isLowStock(item);
          const imageSrc = item.image
            ? item.image.startsWith('http') || item.image.startsWith('/uploads')
              ? item.image
              : `/uploads/${item.image}`
            : null;
          const displayTitle = combinedItemTitle(item) || item.name || 'Item';

          return (
            <StyledCard
              key={item._id}
              hoverable
              bordered={false}
              style={{
                backgroundColor: isLow ? '#fff5f5' : '#ffffff',
                borderLeft: isLow ? '3px solid #ef4444' : undefined,
                cursor: 'pointer',
                position: 'relative',
              }}
              onClick={() => setDetailItem(item)}>
              {imageSrc && (
                <img
                  src={imageSrc}
                  alt={displayTitle}
                  style={{
                    width: '100%',
                    height: '180px',
                    objectFit: 'cover',
                    borderRadius: '12px',
                    marginBottom: '0.75rem',
                  }}
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
              )}
              <HeartFilled
                style={{
                  position: 'absolute',
                  top: 14,
                  right: 14,
                  fontSize: 20,
                  color: '#ef4444',
                  cursor: 'pointer',
                  zIndex: 2,
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  removeFavorite(item._id);
                  dispatch(updateFavorites(favorites.filter((id) => id !== item._id)));
                }}
              />
              <h3>{displayTitle}</h3>
              <p><b>Supplier:</b> {item.supplier}</p>
              <p><b>Catalog No.:</b> {item.catalog}</p>
              {item.quantity !== undefined && (
                <p><b>Qty:</b> {item.quantity} {item.quantityUnit || 'items'}</p>
              )}
              <div style={{ display: 'flex' }} onClick={(e) => e.stopPropagation()}>
                <UpdateItem item={item} />
                <DeleteModal name={displayTitle} id={item._id} category={item.category} />
              </div>
            </StyledCard>
          );
        })}
      </div>
    </div>
  );
};

export default FavoritesPage;
