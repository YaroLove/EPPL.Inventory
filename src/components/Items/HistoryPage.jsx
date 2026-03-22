import React from 'react';
import { Timeline, Spin, Empty, Tag } from 'antd';
import {
  PlusCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import styled from 'styled-components';
import moment from 'moment';
import { useGetHistoryQuery } from '../../services/historyApi';

const PageWrapper = styled.div`
  max-width: 760px;
  margin: 0 auto;
  padding: 1.5rem 1rem 3rem;
`;

const PageHeader = styled.div`
  margin-bottom: 1.5rem;
  h2 {
    font-size: 1.4rem;
    font-weight: 700;
    color: var(--text-1);
    margin: 0 0 0.25rem;
  }
  p { color: var(--text-2); margin: 0; font-size: 0.875rem; }
`;

const EntryCard = styled.div`
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 0.6rem 0.875rem;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
`;

const ItemName = styled.span`
  font-weight: 600;
  color: var(--text-1);
`;

const Meta = styled.span`
  color: var(--text-3);
  font-size: 0.78rem;
  white-space: nowrap;
`;

const ACTION_CONFIG = {
  added:   { color: '#16a34a', icon: <PlusCircleOutlined />,  label: 'added',   tagColor: 'green' },
  deleted: { color: '#dc2626', icon: <DeleteOutlined />,      label: 'deleted', tagColor: 'red'   },
  edited:  { color: '#2563eb', icon: <EditOutlined />,        label: 'edited',  tagColor: 'blue'  },
  updated: { color: '#d97706', icon: <ReloadOutlined />,      label: 'qty updated', tagColor: 'orange' },
};

const HistoryPage = () => {
  const { data: logs = [], isLoading } = useGetHistoryQuery();

  return (
    <PageWrapper>
      <PageHeader>
        <h2>History Log</h2>
        <p>All inventory actions across all users</p>
      </PageHeader>

      {isLoading && <Spin style={{ display: 'block', margin: '2rem auto' }} />}

      {!isLoading && logs.length === 0 && (
        <Empty description="No activity yet" style={{ margin: '3rem auto' }} />
      )}

      {!isLoading && logs.length > 0 && (
        <Timeline mode="left">
          {logs.map((log) => {
            const cfg = ACTION_CONFIG[log.action] || ACTION_CONFIG.edited;
            return (
              <Timeline.Item
                key={log._id}
                color={cfg.color}
                dot={<span style={{ fontSize: 16 }}>{cfg.icon}</span>}>
                <EntryCard>
                  <div>
                    <ItemName>{log.itemName}</ItemName>
                    {' '}
                    <Tag color={cfg.tagColor} style={{ fontSize: '0.75rem' }}>
                      {cfg.label}
                    </Tag>
                    {log.username && (
                      <span style={{ color: 'var(--text-2)', fontSize: '0.82rem' }}>
                        {' '}by <b>{log.username}</b>
                      </span>
                    )}
                  </div>
                  <Meta>{moment(log.timestamp).format('MMM D, YYYY · h:mm A')}</Meta>
                </EntryCard>
              </Timeline.Item>
            );
          })}
        </Timeline>
      )}
    </PageWrapper>
  );
};

export default HistoryPage;
