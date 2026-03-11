import React, { useState } from 'react';
import styled from 'styled-components';
import { Modal, Button, Form, Input, Select, InputNumber } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { useUpdateItemMutation } from '../../services/items.js';
import { useGetCategoriesQuery } from '../../services/categories.js';
import { useGetSuppliersQuery } from '../../services/suppliers.js';

const StyledButton = styled(Button)`
  margin-top: 1rem;
  margin-right: 1rem;
`;

const UpdateItem = (props) => {
  const [visible, setVisible] = useState(false);
  const [updateItem] = useUpdateItemMutation();
  const { data: categories = [] } = useGetCategoriesQuery();
  const { data: suppliers = [] } = useGetSuppliersQuery();

  const [itemCategory, setItemCategory] = useState(props.category);
  const [name, setName] = useState();
  const [supplier, setSupplier] = useState();
  const [catalog, setCatalog] = useState();
  const [species, setSpecies] = useState();
  const [description, setDescription] = useState();
  const [freeze, setFreeze] = useState();
  const [maintenance, setMaintenance] = useState();
  const [qty, setQty] = useState();

  const handleSubmit = async () => {
    setVisible(false);
    const updateInfo = {
      id: props.id,
      category: itemCategory || props.category,
    };
    const maybeFields = {
      name,
      supplier,
      catalog,
      description,
      quantity: qty,
      species,
      lastFreeze: freeze,
      lastMaintenance: maintenance,
    };
    Object.entries(maybeFields).forEach(([key, val]) => {
      if (val !== undefined && val !== '') updateInfo[key] = val;
    });
    await updateItem(updateInfo);
  };

  return (
    <div>
      <StyledButton
        type="secondary"
        icon={<EditOutlined />}
        size={'default'}
        onClick={() => setVisible(true)}>
        Update
      </StyledButton>
      <Modal
        title="Enter new details for your item"
        centered
        visible={visible}
        onOk={handleSubmit}
        onCancel={() => setVisible(false)}
        width={850}>
        <Form
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 14 }}
          layout="horizontal"
          size={'default'}>
          <Form.Item label="Item category" required>
            <Select onChange={(val) => setItemCategory(val)} value={itemCategory}>
              {categories.map((cat) => (
                <Select.Option key={cat._id} value={cat.name}>
                  {cat.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="Name">
            <Input onChange={(e) => setName(e.target.value)} />
          </Form.Item>
          <Form.Item label="Supplier">
            <Select
              value={supplier}
              placeholder="Select a supplier"
              onChange={(val) => setSupplier(val)}
              showSearch
              optionFilterProp="children"
              allowClear
            >
              {suppliers.map((sup) => (
                <Select.Option key={sup._id} value={sup.name}>
                  {sup.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="Species">
            <Input onChange={(e) => setSpecies(e.target.value)} />
          </Form.Item>
          <Form.Item label="Catalog No.">
            <Input onChange={(e) => setCatalog(e.target.value)} />
          </Form.Item>
          <Form.Item label="Description">
            <Input onChange={(e) => setDescription(e.target.value)} />
          </Form.Item>
          <Form.Item label="Last freeze">
            <Input onChange={(e) => setFreeze(e.target.value)} />
          </Form.Item>
          <Form.Item label="Last maintenance">
            <Input onChange={(e) => setMaintenance(e.target.value)} />
          </Form.Item>
          <Form.Item label="Quantity">
            <InputNumber onChange={(val) => setQty(val)} name="qty" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UpdateItem;
