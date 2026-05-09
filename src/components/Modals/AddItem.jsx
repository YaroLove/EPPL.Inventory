import React, { useState, useEffect, useMemo, useCallback } from 'react';
import styled from 'styled-components';
import {
  Modal,
  Button,
  Form,
  Input,
  Select,
  message,
  Collapse,
  Popconfirm,
} from 'antd';
import { DownloadOutlined, EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import moment from 'moment';
import { useAddItemMutation } from '../../services/items.js';
import { useGetCategoriesQuery, useAddCategoryMutation } from '../../services/categories.js';
import { useGetSuppliersQuery, useAddSupplierMutation } from '../../services/suppliers.js';
import {
  useGetFieldDefinitionsQuery,
  useAddFieldDefinitionMutation,
  useUpdateFieldDefinitionMutation,
  useDeleteFieldDefinitionMutation,
} from '../../services/fieldDefinitions.js';
import { DynamicFieldInput } from './DynamicFieldInput.jsx';
import { buildItemPayload } from '../../utils/itemFormUtils.js';
import {
  FieldRow,
  CategorySelectWithAdd,
  SupplierSelectWithAdd,
} from './ItemFormShared.jsx';

const StyledButton = styled(Button)`
  margin-top: 1rem;
  margin-right: 1rem;
`;

const AddItem = () => {
  const [visible, setVisible] = useState(false);
  const [addItem] = useAddItemMutation();
  const { data: categories = [] } = useGetCategoriesQuery();
  const { data: suppliers = [] } = useGetSuppliersQuery();
  const { data: fieldDefinitions = [], refetch: refetchDefs } = useGetFieldDefinitionsQuery();
  const [addCategory] = useAddCategoryMutation();
  const [addSupplier] = useAddSupplierMutation();
  const [addFieldDefinition] = useAddFieldDefinitionMutation();
  const [updateFieldDefinition] = useUpdateFieldDefinitionMutation();
  const [deleteFieldDefinition] = useDeleteFieldDefinitionMutation();

  const [values, setValues] = useState({});
  const [category, setCategory] = useState('');
  const [imagePath, setImagePath] = useState('');
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newSupplierName, setNewSupplierName] = useState('');
  const [editDef, setEditDef] = useState(null);
  const [addFieldVisible, setAddFieldVisible] = useState(false);
  const [newFieldForm, setNewFieldForm] = useState({
    label: '',
    fieldKey: '',
    fieldType: 'text',
    section: 'optional',
  });

  const sortedRequired = useMemo(
    () =>
      fieldDefinitions
        .filter((d) => d.section === 'required')
        .sort((a, b) => (a.order || 0) - (b.order || 0)),
    [fieldDefinitions]
  );

  const sortedOptional = useMemo(
    () =>
      fieldDefinitions
        .filter((d) => d.section === 'optional')
        .sort((a, b) => (a.order || 0) - (b.order || 0)),
    [fieldDefinitions]
  );

  const setVal = useCallback((key, v) => {
    setValues((prev) => ({ ...prev, [key]: v }));
  }, []);

  useEffect(() => {
    if (!visible || !fieldDefinitions.length) return;
    setValues((prev) => {
      const next = { ...prev };
      fieldDefinitions.forEach((d) => {
        if (next[d.fieldKey] === undefined) {
          if (d.fieldType === 'quantity_with_unit') {
            next.quantity = next.quantity ?? 0;
            next.quantityUnit = next.quantityUnit ?? 'items';
          } else if (d.fieldType === 'number') {
            next[d.fieldKey] = next[d.fieldKey] ?? undefined;
          } else {
            next[d.fieldKey] = next[d.fieldKey] ?? '';
          }
        }
      });
      if (next.quantityUnit === undefined) next.quantityUnit = 'items';
      if (next.quantity === undefined) next.quantity = 0;
      return next;
    });
  }, [visible, fieldDefinitions]);

  useEffect(() => {
    if (visible && !category && categories.length) {
      setCategory(categories[0].name);
    }
  }, [visible, categories, category]);

  const handleUpload = (info) => {
    if (info.file.status === 'done') {
      message.success(`${info.file.name} file uploaded successfully`);
      const path = info.file.response?.filePath || '';
      setImagePath(path);
      setVal('image', path);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  };

  const uploadProps = {
    name: 'image',
    action: '/upload',
    withCredentials: true,
    onChange: handleUpload,
    maxCount: 1,
    showUploadList: true,
  };

  const handleAddCategoryInline = async () => {
    const name = newCategoryName.trim();
    if (!name) return;
    try {
      const res = await addCategory({ name }).unwrap();
      setCategory(res.name);
      setNewCategoryName('');
      message.success('Category added');
    } catch (e) {
      message.error('Could not add category');
    }
  };

  const handleAddSupplierInline = async () => {
    const name = newSupplierName.trim();
    if (!name) return;
    try {
      const res = await addSupplier({ name }).unwrap();
      setVal('supplier', res.name);
      setNewSupplierName('');
      message.success('Supplier added');
    } catch (e) {
      message.error('Could not add supplier');
    }
  };

  const validateRequired = () => {
    for (const d of sortedRequired) {
      if (!d.required) continue;

      // Category value lives in `category` state, not in `values`
      if (d.fieldType === 'select_category') {
        if (!category || String(category).trim() === '') {
          message.warning(`Please fill: ${d.label}`);
          return false;
        }
        continue;
      }

      if (d.fieldType === 'quantity_with_unit') {
        if (values.quantity === undefined || values.quantity === null || values.quantity === '') {
          message.warning(`Please fill: Quantity`);
          return false;
        }
        continue;
      }
      const v = values[d.fieldKey];
      if (d.fieldType === 'number') {
        if (v === undefined || v === null || v === '') {
          message.warning(`Please fill: ${d.label}`);
          return false;
        }
        continue;
      }
      if (v === undefined || v === null || String(v).trim() === '') {
        message.warning(`Please fill: ${d.label}`);
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!category) {
      message.warning('Please select a category');
      return;
    }
    if (!validateRequired()) return;

    const merged = { ...values, image: imagePath || values.image };
    const body = buildItemPayload(merged, category);

    if (body.expirationDate) {
      body.expirationDate = moment(body.expirationDate).toISOString();
    }
    if (body.lastMaintenance) {
      body.lastMaintenance = moment(body.lastMaintenance).toISOString();
    }
    if (body.calibration) {
      body.calibration = moment(body.calibration).toISOString();
    }

    try {
      await addItem(body).unwrap();
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
    setValues({});
    setCategory(categories.length ? categories[0].name : '');
    setImagePath('');
    setNewCategoryName('');
    setNewSupplierName('');
  };

  const openEdit = (def) => {
    setEditDef({ ...def });
  };

  const saveEditDef = async () => {
    if (!editDef?._id) return;
    try {
      await updateFieldDefinition({
        id: editDef._id,
        label: editDef.label,
        required: editDef.required,
        section: editDef.section,
        order: editDef.order,
        fieldType: editDef.fieldType,
      }).unwrap();
      message.success('Field updated');
      setEditDef(null);
      refetchDefs();
    } catch (e) {
      message.error('Update failed');
    }
  };

  const removeDef = async (def) => {
    try {
      await deleteFieldDefinition(def._id).unwrap();
      message.success('Field removed');
      refetchDefs();
    } catch (e) {
      message.error(e?.data?.error || 'Delete failed');
    }
  };

  const handleAddCustomField = async () => {
    const label = newFieldForm.label.trim();
    const fieldKey = newFieldForm.fieldKey.trim();
    if (!label || !fieldKey) {
      message.warning('Label and field key are required');
      return;
    }
    try {
      await addFieldDefinition({
        label,
        fieldKey,
        fieldType: newFieldForm.fieldType,
        section: newFieldForm.section,
      }).unwrap();
      message.success('Field added');
      setAddFieldVisible(false);
      setNewFieldForm({ label: '', fieldKey: '', fieldType: 'text', section: 'optional' });
      refetchDefs();
    } catch (e) {
      message.error('Could not add field');
    }
  };

  const renderControl = (def) => {
    if (def.fieldType === 'select_category') {
      return (
        <CategorySelectWithAdd
          value={category}
          onChange={setCategory}
          categories={categories}
          newCategoryName={newCategoryName}
          setNewCategoryName={setNewCategoryName}
          onAddCategory={handleAddCategoryInline}
        />
      );
    }
    if (def.fieldType === 'select_supplier') {
      return (
        <SupplierSelectWithAdd
          value={values.supplier}
          onChange={(v) => setVal('supplier', v)}
          suppliers={suppliers}
          newSupplierName={newSupplierName}
          setNewSupplierName={setNewSupplierName}
          onAddSupplier={handleAddSupplierInline}
        />
      );
    }
    if (def.fieldType === 'quantity_with_unit') {
      return (
        <DynamicFieldInput
          def={def}
          value={values.quantity}
          onChange={(v) => setVal('quantity', v)}
          quantityUnit={values.quantityUnit}
          onQuantityUnitChange={(u) => setVal('quantityUnit', u)}
        />
      );
    }
    if (def.fieldType === 'upload') {
      return (
        <DynamicFieldInput
          def={def}
          value={values.image}
          onChange={(v) => setVal('image', v)}
          uploadProps={uploadProps}
        />
      );
    }
    return (
      <DynamicFieldInput
        def={def}
        value={values[def.fieldKey]}
        onChange={(v) => setVal(def.fieldKey, v)}
      />
    );
  };

  const renderFieldRow = (def) => {
    const label = (
      <span>
        {def.label}
        {def.required ? <span style={{ color: '#cf1322' }}> *</span> : null}
      </span>
    );

    return (
      <FieldRow key={def._id}>
        <div className="field-label">{label}</div>
        <div className="field-control">{renderControl(def)}</div>
        <div className="field-actions">
          <Button type="text" size="small" icon={<EditOutlined />} onClick={() => openEdit(def)} />
          <Popconfirm title="Remove this field from the form?" onConfirm={() => removeDef(def)}>
            <Button type="text" size="small" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </div>
      </FieldRow>
    );
  };

  return (
    <div>
      <StyledButton
        type="primary"
        shape="round"
        icon={<DownloadOutlined />}
        size="default"
        onClick={() => {
          if (!category && categories.length) setCategory(categories[0].name);
          setVisible(true);
        }}
      >
        Add New Item
      </StyledButton>
      <Modal
        title="Enter details for your new item"
        centered
        visible={visible}
        onOk={handleSubmit}
        onCancel={() => setVisible(false)}
        width="90vw"
        style={{ maxWidth: 900 }}
      >
        <Form labelCol={{ span: 0 }} wrapperCol={{ span: 24 }} layout="vertical" size="default">
          <div style={{ marginBottom: 16 }}>
            {sortedRequired.map((def) => renderFieldRow(def))}
          </div>

          <Collapse defaultActiveKey={[]} ghost>
            <Collapse.Panel header="Optional fields" key="optional">
              {sortedOptional.map((def) => renderFieldRow(def))}
              <Button
                type="dashed"
                icon={<PlusOutlined />}
                onClick={() => setAddFieldVisible(true)}
                style={{ marginTop: 8 }}
              >
                Add new field
              </Button>
            </Collapse.Panel>
          </Collapse>
        </Form>
      </Modal>

      <Modal
        title="Edit field"
        visible={!!editDef}
        onCancel={() => setEditDef(null)}
        onOk={saveEditDef}
        destroyOnClose
      >
        {editDef && (
          <Form layout="vertical">
            <Form.Item label="Label">
              <Input
                value={editDef.label}
                onChange={(e) => setEditDef({ ...editDef, label: e.target.value })}
              />
            </Form.Item>
            <Form.Item label="Field key">
              <Input value={editDef.fieldKey} disabled={editDef.builtin} />
            </Form.Item>
            <Form.Item label="Type">
              <Select
                value={editDef.fieldType}
                disabled={editDef.builtin}
                onChange={(v) => setEditDef({ ...editDef, fieldType: v })}
              >
                {['text', 'number', 'date', 'select_category', 'select_supplier', 'quantity_with_unit', 'upload'].map(
                  (t) => (
                    <Select.Option key={t} value={t}>
                      {t}
                    </Select.Option>
                  )
                )}
              </Select>
            </Form.Item>
            <Form.Item label="Required">
              <Select
                value={editDef.required}
                onChange={(v) => setEditDef({ ...editDef, required: v })}
              >
                <Select.Option value={true}>Yes</Select.Option>
                <Select.Option value={false}>No</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item label="Section">
              <Select
                value={editDef.section}
                onChange={(v) => setEditDef({ ...editDef, section: v })}
              >
                <Select.Option value="required">Required (top)</Select.Option>
                <Select.Option value="optional">Optional (collapsed)</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item label="Order">
              <Input
                type="number"
                value={editDef.order}
                onChange={(e) => setEditDef({ ...editDef, order: Number(e.target.value) })}
              />
            </Form.Item>
          </Form>
        )}
      </Modal>

      <Modal
        title="Add custom field"
        visible={addFieldVisible}
        onCancel={() => setAddFieldVisible(false)}
        onOk={handleAddCustomField}
      >
        <Form layout="vertical">
          <Form.Item label="Label" required>
            <Input
              value={newFieldForm.label}
              onChange={(e) => setNewFieldForm({ ...newFieldForm, label: e.target.value })}
            />
          </Form.Item>
          <Form.Item label="Field key (letters, numbers, underscore)" required>
            <Input
              placeholder="e.g. batchNumber"
              value={newFieldForm.fieldKey}
              onChange={(e) => setNewFieldForm({ ...newFieldForm, fieldKey: e.target.value })}
            />
          </Form.Item>
          <Form.Item label="Type">
            <Select
              value={newFieldForm.fieldType}
              onChange={(v) => setNewFieldForm({ ...newFieldForm, fieldType: v })}
            >
              <Select.Option value="text">Text</Select.Option>
              <Select.Option value="number">Number</Select.Option>
              <Select.Option value="date">Date</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="Section">
            <Select
              value={newFieldForm.section}
              onChange={(v) => setNewFieldForm({ ...newFieldForm, section: v })}
            >
              <Select.Option value="required">Required (top)</Select.Option>
              <Select.Option value="optional">Optional (collapsed)</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AddItem;
