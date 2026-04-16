import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Affix } from 'antd';

import 'antd/dist/antd.css';
import { SearchBar } from '../Items/SearchBar.jsx';
import AddItem from '../Modals/AddItem.jsx';
import GenericItemsList from '../Items/GenericItemsList.jsx';
import AllItemsList from '../Items/AllItemsList.jsx';
import FavoritesPage from '../Items/FavoritesPage.jsx';
import HistoryPage from '../Items/HistoryPage.jsx';
import SettingsPage from './SettingsPage.jsx';
import ExportToolbar from '../Items/ExportToolbar.jsx';
import { useSelector } from 'react-redux';
import DefaultPage from '../Items/DefaultPage.jsx';
import Dashboard from '../Dashboard/Dashboard.jsx';

import { useGetItemsQuery, useGetItemsBySupplierQuery, useGetAllItemsQuery } from '../../services/items.js';

const Wrapper = styled.div`
  width: 100%;
  max-width: 1400px;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 1.25rem;

  @media (max-width: 768px) {
    gap: 0.75rem;
    padding: 0.5rem;
  }
`;

const Toolbar = styled.div`
  display: flex;
  background-color: #ffffff;
  width: 100%;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border-radius: 14px;
  border: 1px solid var(--border);
  box-shadow: var(--shadow-card);

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    padding: 0.6rem 0.75rem;
    gap: 0.5rem;
    border-radius: 0;
    border-left: none;
    border-right: none;
  }
`;

// Returns true for views where the Export toolbar should appear
function isExportableView(displayType, displayValue) {
  return (
    displayType === 'category' ||
    displayType === 'supplier' ||
    (displayType === 'allitems' && displayValue === 'all')
  );
}

const ItemsContainer = () => {
  const display = useSelector((state) => state.display.display);
  const displayType = display?.type || 'page';
  const displayValue = display?.value || display;

  const [selectedIds, setSelectedIds] = useState(new Set());
  const [pendingSelectAll, setPendingSelectAll] = useState(false);

  const showExport = isExportableView(displayType, displayValue);

  const catData  = useGetItemsQuery(displayValue, { skip: displayType !== 'category' });
  const supData  = useGetItemsBySupplierQuery(displayValue, { skip: displayType !== 'supplier' });
  const allData  = useGetAllItemsQuery(undefined, { skip: displayType !== 'allitems' });

  const currentItems =
    displayType === 'category' ? (catData.data || []) :
    displayType === 'supplier' ? (supData.data || []) :
    displayType === 'allitems' ? (allData.data || []) : [];

  useEffect(() => {
    setSelectedIds(new Set());
    setPendingSelectAll(false);
  }, [displayType, displayValue]);

  useEffect(() => {
    if (pendingSelectAll && currentItems.length > 0) {
      setSelectedIds(new Set(currentItems.map((i) => i._id)));
      setPendingSelectAll(false);
    }
  }, [currentItems, pendingSelectAll]);

  const exportLabel =
    displayType === 'category' ? displayValue :
    displayType === 'supplier' ? displayValue :
    'all-inventory';

  const toggleSelect = (id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const selectAll = () => {
    if (currentItems.length > 0) {
      setSelectedIds(new Set(currentItems.map((i) => i._id)));
    } else {
      // Data still loading — defer selection until items arrive
      setPendingSelectAll(true);
    }
  };
  const deselectAll = () => {
    setSelectedIds(new Set());
    setPendingSelectAll(false);
  };

  return (
    <Wrapper>
      <Affix offsetTop={0}>
        <Toolbar>
          <AddItem />
          <SearchBar />
          {showExport && (
            <ExportToolbar
              allItems={currentItems}
              selectedIds={selectedIds}
              onSelectAll={selectAll}
              onDeselectAll={deselectAll}
              exportLabel={exportLabel}
            />
          )}
        </Toolbar>
      </Affix>

      {displayType === 'page' && displayValue === 'default'    && <DefaultPage />}
      {displayType === 'page' && displayValue === 'dashboard'  && <Dashboard />}
      {displayType === 'page' && displayValue === 'favorites'  && <FavoritesPage />}
      {displayType === 'page' && displayValue === 'history'    && <HistoryPage />}
      {displayType === 'page' && displayValue === 'settings'   && <SettingsPage />}

      {displayType === 'category' && (
        <GenericItemsList
          key={`cat-${displayValue}`}
          category={displayValue}
          selectedIds={selectedIds}
          onToggleSelect={selectedIds.size > 0 ? toggleSelect : null}
        />
      )}
      {displayType === 'supplier' && (
        <GenericItemsList
          key={`sup-${displayValue}`}
          supplier={displayValue}
          selectedIds={selectedIds}
          onToggleSelect={selectedIds.size > 0 ? toggleSelect : null}
        />
      )}
      {displayType === 'allitems' && (
        <AllItemsList
          selectedIds={selectedIds}
          onToggleSelect={selectedIds.size > 0 ? toggleSelect : null}
        />
      )}
    </Wrapper>
  );
};

export default ItemsContainer;
