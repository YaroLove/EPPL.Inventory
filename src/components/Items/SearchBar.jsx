import React from 'react';
import { Input } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { setFilter } from './filterSlice';

const { Search } = Input;

export const SearchBar = () => {
  const searchInput = useSelector((state) => state.filter.filter);
  const dispatch = useDispatch();

  const filter = (e) => {
    dispatch(setFilter(e.target.value));
  };

  const onSearch = (value) => {
    // Pressing Enter or clicking the search button dispatches the same action
    dispatch(setFilter(value));
  };

  return (
    <div className="inventory-search-wrapper">
      <Search
        placeholder="Search inventory"
        allowClear
        className="inventory-search"
        style={{ width: 'min(520px, 70vw)', margin: '1rem 1rem' }}
        onChange={filter}
        onSearch={onSearch}
        value={searchInput}
        aria-label="Search inventory"
      />
    </div>
  );
};
