import React, { useState } from 'react';
import { Button, Select, Tooltip, Space } from 'antd';
import {
  CheckSquareOutlined,
  CloseSquareOutlined,
  ExportOutlined,
  DownloadOutlined,
} from '@ant-design/icons';
import styled from 'styled-components';
import { exportCsv, exportXlsx, exportPdf } from '../../utils/exportUtils';

const Toolbar = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const CountBadge = styled.span`
  background: var(--brand-green);
  color: #fff;
  border-radius: 999px;
  padding: 0 0.5rem;
  font-size: 0.78rem;
  font-weight: 600;
  min-width: 24px;
  text-align: center;
  display: inline-block;
`;

const GreenBtn = styled(Button)`
  background: var(--brand-green) !important;
  border-color: var(--brand-green) !important;
  color: #fff !important;
  border-radius: 8px !important;
  &:hover { opacity: 0.88; }
`;

const ExportToolbar = ({ allItems = [], selectedIds, onSelectAll, onDeselectAll, exportLabel = 'inventory' }) => {
  const [format, setFormat] = useState('xlsx');
  const count = selectedIds?.size || 0;

  const handleExport = () => {
    const itemsToExport = allItems.filter((item) => selectedIds?.has(item._id));
    if (itemsToExport.length === 0) return;

    const filename = `${exportLabel}-${new Date().toISOString().slice(0, 10)}`;
    if (format === 'csv') exportCsv(itemsToExport, filename);
    else if (format === 'pdf') exportPdf(itemsToExport, `${exportLabel} Export`, filename);
    else exportXlsx(itemsToExport, filename);
  };

  return (
    <Toolbar>
      <Tooltip title="Select all items">
        <Button
          size="small"
          icon={<CheckSquareOutlined />}
          onClick={onSelectAll}
          style={{ borderRadius: 8 }}>
          All
        </Button>
      </Tooltip>
      <Tooltip title="Deselect all">
        <Button
          size="small"
          icon={<CloseSquareOutlined />}
          onClick={onDeselectAll}
          disabled={count === 0}
          style={{ borderRadius: 8 }}>
          None
        </Button>
      </Tooltip>
      {count > 0 && <CountBadge>{count} selected</CountBadge>}
      <Select
        size="small"
        value={format}
        onChange={setFormat}
        style={{ width: 90, borderRadius: 8 }}
        options={[
          { value: 'xlsx', label: 'Excel' },
          { value: 'csv',  label: 'CSV'   },
          { value: 'pdf',  label: 'PDF'   },
        ]}
      />
      <GreenBtn
        size="small"
        icon={<DownloadOutlined />}
        onClick={handleExport}
        disabled={count === 0}>
        Export
      </GreenBtn>
    </Toolbar>
  );
};

export default ExportToolbar;
