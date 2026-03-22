import React from 'react';
import styled from 'styled-components';
import { Button, Input, Select, Space, Divider } from 'antd';

export const FieldRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin-bottom: 12px;

  .field-label {
    flex: 0 0 200px;
    padding-top: 5px;
  }
  .field-control {
    flex: 1;
    min-width: 0;
  }
  .field-actions {
    flex: 0 0 auto;
    padding-top: 4px;
  }
`;

export function CategorySelectWithAdd({
  value,
  onChange,
  categories,
  newCategoryName,
  setNewCategoryName,
  onAddCategory,
}) {
  return (
    <Select
      value={value || undefined}
      placeholder="Select a category"
      onChange={onChange}
      showSearch
      optionFilterProp="children"
      dropdownRender={(menu) => (
        <>
          {menu}
          <Divider style={{ margin: '8px 0' }} />
          <Space style={{ padding: '0 8px 8px', width: '100%' }} align="start">
            <Input
              placeholder="New category name"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              onPressEnter={() => onAddCategory()}
            />
            <Button type="link" onClick={() => onAddCategory()}>
              Add
            </Button>
          </Space>
        </>
      )}
    >
      {categories.map((cat) => (
        <Select.Option key={cat._id} value={cat.name}>
          {cat.name}
        </Select.Option>
      ))}
    </Select>
  );
}

export function SupplierSelectWithAdd({
  value,
  onChange,
  suppliers,
  newSupplierName,
  setNewSupplierName,
  onAddSupplier,
}) {
  return (
    <Select
      value={value || undefined}
      placeholder="Select a supplier"
      onChange={onChange}
      showSearch
      optionFilterProp="children"
      dropdownRender={(menu) => (
        <>
          {menu}
          <Divider style={{ margin: '8px 0' }} />
          <Space style={{ padding: '0 8px 8px', width: '100%' }} align="start">
            <Input
              placeholder="New supplier name"
              value={newSupplierName}
              onChange={(e) => setNewSupplierName(e.target.value)}
              onPressEnter={() => onAddSupplier()}
            />
            <Button type="link" onClick={() => onAddSupplier()}>
              Add
            </Button>
          </Space>
        </>
      )}
    >
      {suppliers.map((sup) => (
        <Select.Option key={sup._id} value={sup.name}>
          {sup.name}
        </Select.Option>
      ))}
    </Select>
  );
}
