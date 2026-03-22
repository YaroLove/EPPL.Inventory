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

import { useGetItemsQuery, useGetItemsBySupplierQuery } from '../../services/items.js';
import { useAddFavoriteMutation, useRemoveFavoriteMutation } from '../../services/userApi.js';
import { combinedItemTitle } from '../../utils/itemFormUtils.js';

const StyledSpin = styled(Spin)`
  margin: 2rem;
`;

const GenericItemsList = ({ category, supplier, selectedIds, onToggleSelect }) => {
  const categoryResult = useGetItemsQuery(category, { skip: !category });
  const supplierResult = useGetItemsBySupplierQuery(supplier, { skip: !supplier });

  const activeResult = category ? categoryResult : supplierResult;
  const { data, error, isLoading, isSuccess, isError } = activeResult;

  const dispatch = useDispatch();
  const searchInput = useSelector((state) => state.filter.filter);
  const favorites = useSelector((state) => state.login.favorites || []);
  const [foundItems, setFoundItems] = useState(null);
  const [detailItem, setDetailItem] = useState(null);
  const [addFavorite] = useAddFavoriteMutation();
  const [removeFavorite] = useRemoveFavoriteMutation();

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

  useEffect(() => {
    if (data) {
      if (searchInput) {
        const q = searchInput.toLowerCase();
        setFoundItems(
          data.filter((item) => {
            const title = combinedItemTitle(item).toLowerCase();
            const catalog = (item.catalog || '').toLowerCase();
            const supplier = (item.supplier || '').toLowerCase();
            const description = (item.description || '').toLowerCase();
            const location = (item.location || '').toLowerCase();
            return (
              title.includes(q) ||
              catalog.includes(q) ||
              supplier.includes(q) ||
              description.includes(q) ||
              location.includes(q)
            );
          })
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
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              )}
              <h3>{displayTitle}</h3>
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
                  <b>Qty:</b> {item.quantity}{' '}
                  {item.quantityUnit || 'items'}
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
              <div
                style={{ display: 'flex' }}
                onClick={(e) => e.stopPropagation()}>
                <UpdateItem item={item} />
                <DeleteModal
                  name={displayTitle}
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
