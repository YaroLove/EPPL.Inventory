import React, { useState } from 'react';
import styled from 'styled-components';
import { Modal, Button, Form, Input, Select, InputNumber, DatePicker, Upload, message } from 'antd';
import { DownloadOutlined, UploadOutlined } from '@ant-design/icons';
import { useAddItemMutation } from '../../services/items.js';

const StyledButton = styled(Button)`
  margin-top: 1rem;
  margin-right: 1rem;
`;

const AddItem = () => {
  const [visible, setVisible] = useState(false);
  const [addItem] = useAddItemMutation();

  // Form State
  const [name, setName] = useState('');
  const [category, setCategory] = useState('consumables');
  const [supplier, setSupplier] = useState('');
  const [catalog, setCatalog] = useState('');
  const [description, setDescription] = useState('');
  const [quantity, setQuantity] = useState(0);
  const [species, setSpecies] = useState('');
  const [lastFreeze, setLastFreeze] = useState('');

  // New Fields
  const [minStock, setMinStock] = useState(5);
  const [location, setLocation] = useState('');
  const [manualUrl, setManualUrl] = useState('');
  const [expirationDate, setExpirationDate] = useState(null);
  const [calibration, setCalibration] = useState(null);
  const [lastMaintenance, setLastMaintenance] = useState(null);
  const [imagePath, setImagePath] = useState('');

  const handleUpload = async (info) => {
    if (info.file.status === 'done') {
      message.success(`${info.file.name} file uploaded successfully`);
      // The response from server is in info.file.response
      setImagePath(info.file.response.filePath);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  };

  const uploadProps = {
    name: 'image',
    action: '/upload',
    headers: {
      authorization: 'authorization-text',
    },
    onChange: handleUpload,
    maxCount: 1,
    showUploadList: true,
  };


  const handleSubmit = async () => {
    const newItem = {
      name,
      category,
      supplier,
      catalog,
      description,
      quantity,
      species,
      lastFreeze,
      // New Fields
      minStock,
      location,
      manualUrl,
      image: imagePath,
      expirationDate: expirationDate ? expirationDate.format() : null,
      calibration: calibration ? calibration.format() : null,
      lastMaintenance: lastMaintenance ? lastMaintenance.format() : null,
    };

    try {
      await addItem(newItem).unwrap();
      message.success('Item added successfully!');
      setVisible(false);
      resetForm();
    } catch (err) {
      console.error(err);
      const serverMsg = err?.data?.error || err?.error || err?.message;
      message.error(serverMsg ? `Failed to add item: ${serverMsg}` : 'Failed to add item.');
    }
  };

  const resetForm = () => {
    setName('');
    setSupplier('');
    setCatalog('');
    setDescription('');
    setQuantity(0);
    setSpecies('');
    setLastFreeze('');
    setMinStock(5);
    setLocation('');
    setManualUrl('');
    setExpirationDate(null);
    setCalibration(null);
    setLastMaintenance(null);
    setImagePath('');
  };


  return (
    <div>
      <StyledButton
        type="primary"
        shape="round"
        icon={<DownloadOutlined />}
        size={'default'}
        onClick={() => setVisible(true)}>
        Add New Item
      </StyledButton>
      <Modal
        title="Enter details for your new item"
        centered
        visible={visible}
        onOk={handleSubmit}
        onCancel={() => setVisible(false)}
        width={850}
      >
        <Form
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 16 }}
          layout="horizontal"
          size={'default'}
        >
          <Form.Item label="Item category" required>
            <Select value={category} onChange={(val) => setCategory(val)}>
              <Select.Option value="consumables">Consumables</Select.Option>
              <Select.Option value="reagents">Reagents</Select.Option>
              <Select.Option value="cells">Cell Lines</Select.Option>
              <Select.Option value="equipment">Equipment</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item label="Name" required>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </Form.Item>

          <Form.Item label="Supplier" required>
            <Input value={supplier} onChange={(e) => setSupplier(e.target.value)} />
          </Form.Item>

          <Form.Item label="Catalog No." required>
            <Input value={catalog} onChange={(e) => setCatalog(e.target.value)} />
          </Form.Item>

          <Form.Item label="Location">
            <Input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g. Shelf A, Room 101" />
          </Form.Item>

          <Form.Item label="Quantity" required>
            <InputNumber value={quantity} onChange={setQuantity} min={0} />
          </Form.Item>

          <Form.Item label="Min. Stock Alert">
            <InputNumber value={minStock} onChange={setMinStock} min={0} />
          </Form.Item>

          <Form.Item label="Description">
            <Input.TextArea value={description} onChange={(e) => setDescription(e.target.value)} />
          </Form.Item>

          {/* Conditional Fields */}
          {category === 'cells' && (
            <>
              <Form.Item label="Species" required>
                <Input value={species} onChange={(e) => setSpecies(e.target.value)} />
              </Form.Item>
              <Form.Item label="Last freeze" required>
                <Input value={lastFreeze} onChange={(e) => setLastFreeze(e.target.value)} />
              </Form.Item>
            </>
          )}

          <Form.Item label="Expiration Date">
            <DatePicker style={{ width: '100%' }} onChange={setExpirationDate} />
          </Form.Item>

          <Form.Item label="Maintenance Date">
            <DatePicker style={{ width: '100%' }} onChange={setLastMaintenance} placeholder="Last Maintenance" />
          </Form.Item>

          <Form.Item label="Calibration Date">
            <DatePicker style={{ width: '100%' }} onChange={setCalibration} placeholder="Last Calibration" />
          </Form.Item>

          <Form.Item label="Manual URL">
            <Input value={manualUrl} onChange={(e) => setManualUrl(e.target.value)} placeholder="Link to PDF manual" />
          </Form.Item>

          <Form.Item label="Photo">
            <Upload {...uploadProps}>
              <Button icon={<UploadOutlined />}>Click to Upload</Button>
            </Upload>
          </Form.Item>

        </Form>
      </Modal>
    </div>
  );
};

export default AddItem;
