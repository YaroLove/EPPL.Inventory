import React from 'react';
import {
  AutoComplete,
  DatePicker,
  InputNumber,
  Select,
  Upload,
  Button,
} from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import moment from 'moment';
import { useFieldSuggestions } from '../../hooks/useFieldSuggestions';
import { QUANTITY_UNITS } from '../../utils/itemFormUtils';

export function DynamicFieldInput({
  def,
  value,
  onChange,
  quantityUnit,
  onQuantityUnitChange,
  uploadProps,
}) {
  const { options } = useFieldSuggestions(def.fieldType === 'text' ? def.fieldKey : null);

  switch (def.fieldType) {
    case 'text':
      return (
        <AutoComplete
          value={value}
          onChange={onChange}
          options={options}
          style={{ width: '100%' }}
          placeholder={def.label}
        />
      );
    case 'number':
      return (
        <InputNumber
          value={value}
          onChange={onChange}
          style={{ width: '100%' }}
          min={0}
        />
      );
    case 'date': {
      const m = value ? moment(value) : null;
      return (
        <DatePicker
          style={{ width: '100%' }}
          value={m}
          onChange={(d) => onChange(d ? d.toISOString() : null)}
        />
      );
    }
    case 'select_category':
      return null;
    case 'select_supplier':
      return null;
    case 'quantity_with_unit':
      return (
        <div style={{ display: 'flex', gap: 8, width: '100%' }}>
          <InputNumber
            value={value}
            onChange={onChange}
            style={{ flex: 1 }}
            min={0}
          />
          <Select
            value={quantityUnit || 'items'}
            onChange={onQuantityUnitChange}
            style={{ minWidth: 110 }}
          >
            {QUANTITY_UNITS.map((u) => (
              <Select.Option key={u} value={u}>
                {u}
              </Select.Option>
            ))}
          </Select>
        </div>
      );
    case 'upload':
      return (
        <Upload {...uploadProps}>
          <Button icon={<UploadOutlined />}>Upload</Button>
        </Upload>
      );
    default:
      return (
        <AutoComplete
          value={value}
          onChange={onChange}
          options={options}
          style={{ width: '100%' }}
        />
      );
  }
}
