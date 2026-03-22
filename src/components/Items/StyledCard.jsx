import React from 'react';
import { Card } from 'antd';
import styled from 'styled-components';

const StyledCard = styled(Card)`
  background: #ffffff !important;
  border: 1px solid var(--border) !important;
  border-radius: var(--radius-l) !important;
  box-shadow: var(--shadow-card) !important;
  color: var(--text-1) !important;
  flex: 1 1 300px;
  max-width: 500px;
  width: 100%;
  height: auto;
  margin: 0.3rem;
  transition: box-shadow 0.2s ease, transform 0.2s ease;

  &:hover {
    box-shadow: var(--shadow-raised) !important;
    transform: translateY(-2px);
  }

  .ant-card-body {
    color: var(--text-1) !important;
  }

  h3 {
    color: var(--text-1) !important;
    font-size: 1rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
    line-height: 1.4;
  }

  p {
    color: var(--text-2) !important;
    font-size: 0.875rem;
    margin: 0.2rem 0;
    line-height: 1.5;
  }

  p b {
    color: var(--text-1) !important;
    font-weight: 500;
  }
`;

export default StyledCard;
