import React, { useState } from 'react';
import styled from 'styled-components';
import { Card, Statistic, Row, Col, List, Input, Button, Checkbox, Spin, Typography, Modal } from 'antd';
import { WarningOutlined, ShopOutlined, CalendarOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { useGetAllItemsQuery } from '../../services/items';
import { combinedItemTitle, isLowStock } from '../../utils/itemFormUtils';
import { useGetShoppingListQuery, useAddShoppingItemMutation, useDeleteShoppingItemMutation } from '../../services/shopping';
import ItemDetailModal from '../Items/ItemDetailModal.jsx';
import moment from 'moment';

const { Title, Text } = Typography;

const DashboardWrapper = styled.div`
  padding: 2rem 2.5rem;
  width: 100%;
  background-color: transparent;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const StyledCard = styled(Card)`
  background: #ffffff !important;
  border: 1px solid var(--border) !important;
  border-radius: var(--radius-l) !important;
  box-shadow: var(--shadow-card) !important;
  transition: box-shadow 0.2s ease, transform 0.2s ease;

  .ant-card-body {
    color: var(--text-1) !important;
  }

  &:hover {
    box-shadow: var(--shadow-raised) !important;
    transform: translateY(-2px);
  }
`;

const StatCard = styled(StyledCard)`
  border-top: 3px solid ${props => props.accent || 'var(--brand-green)'} !important;
  cursor: pointer;

  .ant-statistic-title {
    color: var(--text-2) !important;
    font-size: 0.75rem !important;
    text-transform: uppercase !important;
    letter-spacing: 0.06em !important;
    font-weight: 600 !important;
  }

  .ant-statistic-content-value {
    color: var(--text-1) !important;
    font-size: 2rem !important;
    font-weight: 700 !important;
  }
`;

const SectionTitle = styled(Title)`
  margin-top: 2rem !important;
  margin-bottom: 1.25rem !important;
  font-weight: 700 !important;
  letter-spacing: -0.02em;
  color: var(--text-1) !important;
`;

const AlertCard = styled(Card)`
  margin-bottom: 0.75rem;
  border-radius: var(--radius-m) !important;
  background: #ffffff !important;
  border: 1px solid var(--border) !important;
  border-left: 4px solid ${props => props.color || 'var(--danger)'} !important;
  box-shadow: var(--shadow-card) !important;
  cursor: pointer;
  transition: box-shadow 0.15s ease, transform 0.15s ease;

  &:hover {
    box-shadow: var(--shadow-raised) !important;
    transform: translateY(-1px);
  }

  .ant-card-head {
    border-bottom: none !important;
    padding: 0 16px;
    min-height: 36px;
    background: transparent !important;
  }

  .ant-card-head-title {
    font-size: 0.7rem !important;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: ${props => props.color || 'var(--danger)'} !important;
    font-weight: 700 !important;
    padding: 10px 0 4px !important;
  }

  .ant-card-body {
    padding: 4px 16px 12px !important;
    color: var(--text-1) !important;
  }
`;

const AlertsScroll = styled.div`
  max-height: 520px;
  overflow-y: auto;
  padding-right: 4px;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: #d1d5db;
    border-radius: 4px;
  }
`;

const ShoppingListCard = styled(StyledCard)`
  .ant-list-item {
    padding: 10px 0;
    border-bottom: 1px solid var(--border-light) !important;
  }

  .ant-list-item:last-child {
    border-bottom: none !important;
  }
`;

const ListRow = styled.div`
  cursor: pointer;
  padding: 4px 0;
  border-radius: 6px;
  transition: background 0.15s;

  &:hover {
    background: #f9fafb;
  }
`;

const LIST_MODAL_TITLES = {
  total: 'Total Inventory',
  low: 'Low Stock Items',
  expiring: 'Expiring / Maintenance Items',
};

const Dashboard = () => {
    const { data: allItems = [], isLoading: l1 } = useGetAllItemsQuery();

    const { data: shoppingList, isLoading: l2 } = useGetShoppingListQuery();
    const [addItem] = useAddShoppingItemMutation();
    const [deleteItem] = useDeleteShoppingItemMutation();
    const [newItemName, setNewItemName] = useState('');
    const [listModal, setListModal] = useState(null);
    const [detailItem, setDetailItem] = useState(null);

    const isLoading = l1 || l2;

    if (isLoading) return (
        <div style={{ width: '100%', height: '80vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Spin size="large" />
        </div>
    );

    const totalItemsCount = allItems.length;

    const lowStockItems = allItems.filter(isLowStock);

    const twoMonthsFromNow = moment().add(2, 'months');
    const expiringItems = allItems.filter(item => {
        if (!item.expirationDate) return false;
        return moment(item.expirationDate).isBefore(twoMonthsFromNow);
    });

    const listModalItems = listModal === 'total'
        ? allItems
        : listModal === 'low'
            ? lowStockItems
            : listModal === 'expiring'
                ? expiringItems
                : [];

    const handleAddItem = async () => {
        if (!newItemName.trim()) return;
        await addItem({ name: newItemName });
        setNewItemName('');
    };

    const openItemDetail = (item) => {
        setListModal(null);
        setDetailItem(item);
    };

    const renderListItemDetail = (item) => {
        if (listModal === 'low') {
            return `Current: ${item.quantity} ${item.quantityUnit || 'items'} | Min: ${item.minStock}`;
        }
        if (listModal === 'expiring') {
            return `Expires: ${moment(item.expirationDate).format('MMM Do, YYYY')}`;
        }
        const parts = [];
        if (item.quantity !== undefined) {
            parts.push(`Qty: ${item.quantity} ${item.quantityUnit || 'items'}`);
        }
        if (item.category) parts.push(item.category);
        return parts.join(' · ') || 'View details';
    };

    return (
        <DashboardWrapper>
            <Title level={2} style={{ marginBottom: '1.5rem', fontWeight: 800, color: 'var(--text-1)' }}>Overview</Title>

            <Row gutter={[20, 20]}>
                <Col xs={24} sm={12} lg={8}>
                    <StatCard accent="var(--brand-green)" onClick={() => setListModal('total')}>
                        <Statistic
                            title="Total Inventory"
                            value={totalItemsCount}
                            prefix={<ShopOutlined style={{ color: 'var(--brand-green)' }} />}
                        />
                    </StatCard>
                </Col>
                <Col xs={24} sm={12} lg={8}>
                    <StatCard accent="var(--danger)" onClick={() => setListModal('low')}>
                        <Statistic
                            title="Low Stock"
                            value={lowStockItems.length}
                            valueStyle={{ color: 'var(--danger)', fontWeight: 700 }}
                            prefix={<WarningOutlined style={{ color: 'var(--danger)' }} />}
                        />
                    </StatCard>
                </Col>
                <Col xs={24} sm={12} lg={8}>
                    <StatCard accent="var(--warning)" onClick={() => setListModal('expiring')}>
                        <Statistic
                            title="Expiring / Maint."
                            value={expiringItems.length}
                            valueStyle={{ color: 'var(--warning)', fontWeight: 700 }}
                            prefix={<CalendarOutlined style={{ color: 'var(--warning)' }} />}
                        />
                    </StatCard>
                </Col>
            </Row>

            <Row gutter={[24, 24]} style={{ marginTop: '2rem' }}>
                <Col xs={24} lg={14}>
                    <SectionTitle level={4}>Shopping Checklist</SectionTitle>
                    <ShoppingListCard>
                        <div style={{ display: 'flex', gap: '10px', marginBottom: '1.25rem' }}>
                            <Input
                                size="large"
                                placeholder="What needs restocking?"
                                value={newItemName}
                                onChange={(e) => setNewItemName(e.target.value)}
                                onPressEnter={handleAddItem}
                                style={{ borderRadius: '10px' }}
                            />
                            <Button
                                type="primary"
                                size="large"
                                icon={<PlusOutlined />}
                                onClick={handleAddItem}
                            >
                                Add
                            </Button>
                        </div>
                        <List
                            dataSource={shoppingList}
                            renderItem={item => (
                                <List.Item
                                    actions={[
                                        <Button
                                            type="text"
                                            danger
                                            icon={<DeleteOutlined />}
                                            onClick={() => deleteItem(item._id)}
                                        />
                                    ]}
                                >
                                    <Checkbox style={{ fontSize: '0.95rem', color: 'var(--text-1)' }}>{item.name}</Checkbox>
                                </List.Item>
                            )}
                            locale={{ emptyText: <Text style={{ color: 'var(--text-3)' }}>Your shopping list is clear.</Text> }}
                        />
                    </ShoppingListCard>
                </Col>

                <Col xs={24} lg={10}>
                    <SectionTitle level={4}>Priority Alerts</SectionTitle>
                    <AlertsScroll>
                        {lowStockItems.map(item => (
                            <AlertCard
                                key={item._id}
                                size="small"
                                color="var(--danger)"
                                title="Critical Low Stock"
                                onClick={() => setDetailItem(item)}
                            >
                                <Text strong style={{ color: 'var(--text-1)', fontSize: '0.95rem' }}>{combinedItemTitle(item) || item.name}</Text>
                                <div style={{ marginTop: '4px', color: 'var(--text-2)', fontSize: '0.8rem' }}>
                                    Current: {item.quantity} {item.quantityUnit || 'items'} &nbsp;|&nbsp; Min: {item.minStock}
                                </div>
                            </AlertCard>
                        ))}
                        {expiringItems.map(item => (
                            <AlertCard
                                key={item._id}
                                size="small"
                                color="var(--warning)"
                                title="Expiration Warning"
                                onClick={() => setDetailItem(item)}
                            >
                                <Text strong style={{ color: 'var(--text-1)', fontSize: '0.95rem' }}>{combinedItemTitle(item) || item.name}</Text>
                                <div style={{ marginTop: '4px', color: 'var(--text-2)', fontSize: '0.8rem' }}>
                                    Expires: {moment(item.expirationDate).format('MMM Do, YYYY')}
                                </div>
                            </AlertCard>
                        ))}
                        {lowStockItems.length === 0 && expiringItems.length === 0 && (
                            <StyledCard style={{ textAlign: 'center', padding: '2rem' }}>
                                <Text style={{ color: 'var(--text-3)' }}>System clear. All stock levels and maintenance up to date.</Text>
                            </StyledCard>
                        )}
                    </AlertsScroll>
                </Col>
            </Row>

            <Modal
                title={LIST_MODAL_TITLES[listModal] || ''}
                visible={!!listModal}
                onCancel={() => setListModal(null)}
                footer={null}
                width="90vw"
                style={{ maxWidth: 640 }}
                bodyStyle={{ maxHeight: '60vh', overflowY: 'auto', paddingTop: '0.5rem' }}
            >
                <List
                    dataSource={listModalItems}
                    locale={{ emptyText: 'No items in this category.' }}
                    renderItem={item => (
                        <List.Item style={{ padding: '8px 0' }}>
                            <ListRow onClick={() => openItemDetail(item)} style={{ width: '100%' }}>
                                <Text strong style={{ color: 'var(--text-1)', display: 'block' }}>
                                    {combinedItemTitle(item) || item.name}
                                </Text>
                                <Text type="secondary" style={{ fontSize: '0.8rem' }}>
                                    {renderListItemDetail(item)}
                                </Text>
                            </ListRow>
                        </List.Item>
                    )}
                />
            </Modal>

            <ItemDetailModal
                item={detailItem}
                visible={!!detailItem}
                onClose={() => setDetailItem(null)}
            />

        </DashboardWrapper>
    );
};

export default Dashboard;
