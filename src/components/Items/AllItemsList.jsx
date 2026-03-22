import React, { useState, useEffect } from 'react';
import { Spin } from 'antd';
import { HeartFilled, HeartOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import StyledCard from './StyledCard.jsx';
import DeleteModal from '../Modals/DeleteModal.jsx';
import UpdateItem from '../Modals/UpdateItem.jsx';
import SearchInvalid from './SearchInvalid.jsx';
import ItemDetailModal from './ItemDetailModal.jsx';
import { useSelector, useDispatch } from 'react-redux';
import { updateFavorites } from '../../loginSlice.js';

import { useGetAllItemsQuery } from '../../services/items.js';
import { useAddFavoriteMutation, useRemoveFavoriteMutation } from '../../services/userApi.js';
import { combinedItemTitle } from '../../utils/itemFormUtils.js';

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
  p { color: var(--text-2); margin: 0.25rem 0 0; font-size: 0.875rem; }
`;

const AllItemsList = ({ selectedIds, onToggleSelect }) => {
  const dispatch = useDispatch();
  const { data, isLoading, isSuccess, isError, error } = useGetAllItemsQuery();
  const searchInput = useSelector((state) => state.filter.filter);
  const favorites = useSelector((state) => state.login.favorites || []);
  const [foundItems, setFoundItems] = useState(null);
  const [detailItem, setDetailItem] = useState(null);
  const [addFavorite] = useAddFavoriteMutation();
  const [removeFavorite] = useRemoveFavoriteMutation();

  useEffect(() => {
    if (data) {
      if (searchInput) {
        const q = searchInput.toLowerCase();
        setFoundItems(
          data.filter((item) => {
            const title = combinedItemTitle(item).toLowerCase();
            return (
              title.includes(q) ||
              (item.catalog || '').toLowerCase().includes(q) ||
              (item.supplier || '').toLowerCase().includes(q) ||
              (item.description || '').toLowerCase().includes(q) ||
              (item.category || '').toLowerCase().includes(q)
            );
          })
        );
      } else {
        setFoundItems(data);
      }
    }
  }, [data, searchInput]);

  const displayItems = foundItems || data || [];

  const toggleFavorite = async (e, itemId, isFav) => {
    e.stopPropagation();
    if (isFav) {
      await removeFavorite(itemId);
      dispatch(updateFavorites(favorites.filter((id) => id !== itemId)));
    } else {
      await addFavorite(itemId);
      dispatch(updateFavorites([...favorites, itemId]));
    }
  };

  return (
    <div>
      <PageHeader>
        <h2>All Items</h2>
        <p>{isSuccess ? `${displayItems.length} item${displayItems.length !== 1 ? 's' : ''} across all categories` : ''}</p>
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
        {isError && (
          <div style={{ padding: '2rem', color: '#cf1322' }}>
            Error loading items: {error?.message || 'Unknown error'}
          </div>
        )}
        {isSuccess && displayItems.length === 0 && <SearchInvalid />}

        <ItemDetailModal
          item={detailItem}
          visible={!!detailItem}
          onClose={() => setDetailItem(null)}
        />

        {isSuccess &&
          displayItems.map((item) => {
            const isLow = item.quantity < (item.minStock || 5);
            const imageSrc = item.image
              ? item.image.startsWith('http') || item.image.startsWith('/uploads')
                ? item.image
                : `/uploads/${item.image}`
              : null;
            const displayTitle = combinedItemTitle(item) || item.name || 'Item';
            const isFav = favorites.includes(item._id);
            const isSelected = selectedIds?.has(item._id);

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
                  outline: isSelected ? '2px solid var(--brand-green)' : undefined,
                }}
                onClick={() => {
                  if (onToggleSelect) onToggleSelect(item._id);
                  else setDetailItem(item);
                }}>
                {isFav ? (
                  <HeartFilled
                    style={{ position: 'absolute', top: 14, right: 14, fontSize: 20, color: '#ef4444', zIndex: 2 }}
                    onClick={(e) => toggleFavorite(e, item._id, true)}
                  />
                ) : (
                  <HeartOutlined
                    style={{ position: 'absolute', top: 14, right: 14, fontSize: 20, color: '#d1d5db', zIndex: 2 }}
                    onClick={(e) => toggleFavorite(e, item._id, false)}
                  />
                )}
                {isSelected && (
                  <div
                    style={{
                      position: 'absolute', top: 8, left: 8, width: 20, height: 20,
                      background: 'var(--brand-green)', borderRadius: 4,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: '#fff', fontSize: 12, zIndex: 2,
                    }}>
                    ✓
                  </div>
                )}
                {imageSrc && (
                  <img
                    src={imageSrc}
                    alt={displayTitle}
                    style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '12px', marginBottom: '0.75rem' }}
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                  />
                )}
                <h3>{displayTitle}</h3>
                <p><b>Category:</b> {item.category}</p>
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

export default AllItemsList;
