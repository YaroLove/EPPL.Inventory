import React, { useState } from 'react';
import styled from 'styled-components';
import { Card, Statistic, Row, Col, List, Input, Button, Checkbox, Spin, Typography } from 'antd';
import { WarningOutlined, ShopOutlined, CalendarOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { useGetConsumablesQuery, useGetReagentsQuery, useGetEquipmentQuery, useGetCellsQuery } from '../../services/items';
import { useGetShoppingListQuery, useAddShoppingItemMutation, useDeleteShoppingItemMutation } from '../../services/shopping';
import moment from 'moment';

const { Title, Text } = Typography;

const DashboardWrapper = styled.div`
  padding: 3rem;
  width: 100%;
  background-color: transparent;
`;

const StyledCard = styled(Card)`
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  border: none;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
  }
`;

const SectionTitle = styled(Title)`
  margin-top: 2.5rem !important;
  margin-bottom: 1.5rem !important;
  font-weight: 700 !important;
  letter-spacing: -0.02em;
`;

const AlertCard = styled(Card)`
  margin-bottom: 1rem;
  border-radius: 12px;
  border: none;
  box-shadow: 0 2px 10px rgba(0,0,0,0.03);
  border-left: 6px solid ${props => props.color || '#951717'};
  
  .ant-card-head {
    border-bottom: none;
    padding: 0 16px;
    font-size: 0.8rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: ${props => props.color || '#951717'};
  }
`;

const ShoppingListCard = styled(StyledCard)`
  .ant-list-item {
    padding: 12px 0;
    border-bottom: 1px solid #f0f0f0;
  }
`;

const Dashboard = () => {
    // Fetch Inventory Data
    const { data: consumables, isLoading: l1 } = useGetConsumablesQuery();
    const { data: reagents, isLoading: l2 } = useGetReagentsQuery();
    const { data: equipment, isLoading: l3 } = useGetEquipmentQuery();
    const { data: cells, isLoading: l4 } = useGetCellsQuery();

    // Fetch Shopping List
    const { data: shoppingList, isLoading: l5 } = useGetShoppingListQuery();
    const [addItem] = useAddShoppingItemMutation();
    const [deleteItem] = useDeleteShoppingItemMutation();
    const [newItemName, setNewItemName] = useState('');

    const isLoading = l1 || l2 || l3 || l4 || l5;

    if (isLoading) return (
        <div style={{ width: '100%', height: '80vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Spin size="large" />
        </div>
    );

    // Aggregate Data
    const allItems = [
        ...(consumables || []),
        ...(reagents || []),
        ...(equipment || []),
        ...(cells || [])
    ];

    const totalItemsCount = allItems.length;

    // Logic: Low Stock
    const lowStockItems = allItems.filter(item => {
        const min = item.minStock !== undefined ? item.minStock : 5;
        return (item.quantity !== undefined && item.quantity <= min);
    });

    // Logic: Expiring Soon (2 months)
    const twoMonthsFromNow = moment().add(2, 'months');
    const expiringItems = allItems.filter(item => {
        if (!item.expirationDate) return false;
        return moment(item.expirationDate).isBefore(twoMonthsFromNow);
    });

    // Handler for Shopping List
    const handleAddItem = async () => {
        if (!newItemName.trim()) return;
        await addItem({ name: newItemName });
        setNewItemName('');
    };

    return (
        <DashboardWrapper>
            <Title level={1} style={{ marginBottom: '2.5rem', fontWeight: 800 }}>Overview</Title>

            <Row gutter={[24, 24]}>
                <Col xs={24} md={8}>
                    <StyledCard>
                        <Statistic
                            title="Total Inventory"
                            value={totalItemsCount}
                            prefix={<ShopOutlined style={{ color: '#001529' }} />}
                        />
                    </StyledCard>
                </Col>
                <Col xs={24} md={8}>
                    <StyledCard>
                        <Statistic
                            title="Low Stock"
                            value={lowStockItems.length}
                            valueStyle={{ color: '#951717', fontWeight: 'bold' }}
                            prefix={<WarningOutlined />}
                        />
                    </StyledCard>
                </Col>
                <Col xs={24} md={8}>
                    <StyledCard>
                        <Statistic
                            title="Expiring / Maint."
                            value={expiringItems.length}
                            valueStyle={{ color: '#faad14', fontWeight: 'bold' }}
                            prefix={<CalendarOutlined />}
                        />
                    </StyledCard>
                </Col>
            </Row>

            <Row gutter={[32, 32]} style={{ marginTop: '3rem' }}>
                <Col xs={24} lg={14}>
                    <SectionTitle level={3}>Shopping Checklist</SectionTitle>
                    <ShoppingListCard>
                        <div style={{ display: 'flex', gap: '12px', marginBottom: '1.5rem' }}>
                            <Input
                                size="large"
                                placeholder="What needs restocking?"
                                value={newItemName}
                                onChange={(e) => setNewItemName(e.target.value)}
                                onPressEnter={handleAddItem}
                                style={{ borderRadius: '8px' }}
                            />
                            <Button
                                type="primary"
                                size="large"
                                icon={<PlusOutlined />}
                                onClick={handleAddItem}
                                style={{ borderRadius: '8px', background: '#951717', borderColor: '#951717' }}
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
                                    <Checkbox style={{ fontSize: '1rem' }}>{item.name}</Checkbox>
                                </List.Item>
                            )}
                            locale={{ emptyText: <Text type="secondary">Your shopping list is clear.</Text> }}
                        />
                    </ShoppingListCard>
                </Col>

                <Col xs={24} lg={10}>
                    <SectionTitle level={3}>Priority Alerts</SectionTitle>
                    {lowStockItems.slice(0, 3).map(item => (
                        <AlertCard key={item._id} size="small" color="#951717" title="Critical Low Stock">
                            <Text strong fontSize="1.1rem">{item.name}</Text>
                            <div style={{ marginTop: '4px', color: '#666' }}>Current: {item.quantity} | Min: {item.minStock || 5}</div>
                        </AlertCard>
                    ))}
                    {expiringItems.slice(0, 3).map(item => (
                        <AlertCard key={item._id} size="small" color="#faad14" title="Expiration Warning">
                            <Text strong>{item.name}</Text>
                            <div style={{ marginTop: '4px', color: '#666' }}>Expires: {moment(item.expirationDate).format('MMM Do, YYYY')}</div>
                        </AlertCard>
                    ))}
                    {lowStockItems.length === 0 && expiringItems.length === 0 && (
                        <StyledCard style={{ textAlign: 'center', padding: '2rem' }}>
                            <Text type="secondary">System clear. All stock levels and maintenance up to date.</Text>
                        </StyledCard>
                    )}
                </Col>
            </Row>

        </DashboardWrapper>
    );
};

export default Dashboard;
