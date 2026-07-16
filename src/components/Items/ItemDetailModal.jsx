import React from 'react';
import { Modal, Descriptions, Tag } from 'antd';
import styled from 'styled-components';
import moment from 'moment';
import { combinedItemTitle, isLowStock } from '../../utils/itemFormUtils';

const HeroImage = styled.img`
  width: 100%;
  max-height: 280px;
  object-fit: cover;
  border-radius: 12px;
  margin-bottom: 1.25rem;
  display: block;
`;

const resolveImageSrc = (image) => {
  if (!image) return null;
  if (image.startsWith('http') || image.startsWith('/uploads')) return image;
  return `/uploads/${image}`;
};

const fmt = (d) => (d ? moment(d).format('MMM D, YYYY') : null);

const ItemDetailModal = ({ item, visible, onClose }) => {
  if (!item) return null;

  const title = combinedItemTitle(item) || item.name || 'Item';
  const imageSrc = resolveImageSrc(item.image);
  const isLow = isLowStock(item);

  const customEntries = item.customFields
    ? Object.entries(item.customFields).filter(([, v]) => v !== null && v !== undefined && String(v).trim() !== '')
    : [];

  return (
    <Modal
      title={
        <span style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-1)' }}>
          {title}
          {isLow && (
            <Tag color="red" style={{ marginLeft: 10, fontSize: '0.75rem' }}>
              Low Stock
            </Tag>
          )}
        </span>
      }
      visible={visible}
      onCancel={onClose}
      footer={null}
      width="90vw"
      style={{ maxWidth: 680 }}
      bodyStyle={{ paddingTop: '1rem' }}
    >
      {imageSrc && (
        <HeroImage
          src={imageSrc}
          alt={title}
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />
      )}

      <Descriptions
        column={{ xs: 1, sm: 2 }}
        size="small"
        bordered
        labelStyle={{ fontWeight: 500, color: 'var(--text-1)', background: '#f9fafb', width: 140 }}
        contentStyle={{ color: 'var(--text-2)' }}
      >
        {item.category && (
          <Descriptions.Item label="Category">{item.category}</Descriptions.Item>
        )}
        {item.supplier && (
          <Descriptions.Item label="Supplier">{item.supplier}</Descriptions.Item>
        )}
        {item.catalog && (
          <Descriptions.Item label="Catalog No.">{item.catalog}</Descriptions.Item>
        )}
        {item.quantity !== undefined && (
          <Descriptions.Item label="Quantity">
            {item.quantity} {item.quantityUnit || 'items'}
            {isLow && (
              <Tag color="red" style={{ marginLeft: 8, fontSize: '0.7rem' }}>
                Min: {item.minStock}
              </Tag>
            )}
          </Descriptions.Item>
        )}
        {item.minStock !== undefined && !isLow && (
          <Descriptions.Item label="Min. Stock">{item.minStock}</Descriptions.Item>
        )}
        {item.location && (
          <Descriptions.Item label="Location">{item.location}</Descriptions.Item>
        )}
        {item.description && (
          <Descriptions.Item label="Description" span={2}>
            {item.description}
          </Descriptions.Item>
        )}
        {fmt(item.expirationDate) && (
          <Descriptions.Item label="Expiration Date">{fmt(item.expirationDate)}</Descriptions.Item>
        )}
        {fmt(item.lastMaintenance) && (
          <Descriptions.Item label="Last Maintenance">{fmt(item.lastMaintenance)}</Descriptions.Item>
        )}
        {fmt(item.calibration) && (
          <Descriptions.Item label="Calibration">{fmt(item.calibration)}</Descriptions.Item>
        )}
        {item.species && (
          <Descriptions.Item label="Species">{item.species}</Descriptions.Item>
        )}
        {item.lastFreeze && (
          <Descriptions.Item label="Last Freeze">{item.lastFreeze}</Descriptions.Item>
        )}
        {item.manualUrl && (
          <Descriptions.Item label="Manual URL" span={2}>
            <a href={item.manualUrl} target="_blank" rel="noopener noreferrer">
              {item.manualUrl}
            </a>
          </Descriptions.Item>
        )}
        {customEntries.map(([key, val]) => (
          <Descriptions.Item key={key} label={key}>
            {String(val)}
          </Descriptions.Item>
        ))}
      </Descriptions>
    </Modal>
  );
};

export default ItemDetailModal;
