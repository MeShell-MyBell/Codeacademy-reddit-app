import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import './SearchBar.css';

import {
  clearSearchTerm,
  selectSearchTerm,
  setSearchTerm,
} from './SearchBarSlice';

import { useHistory } from 'react-router-dom';

function SearchBar() {
  const dispatch = useDispatch();
  const searchTerm = useSelector(selectSearchTerm);
  const history = useHistory();

  const onSearchChangeHandler = (e) => {
    dispatch(setSearchTerm(e.target.value));
  };

  const onSearchTermHandler = (e) => {
    if (e.key === 'Enter' && searchTerm.trim() !== '') {
      history.push(`/=${searchTerm.trim()}`);
      dispatch(clearSearchTerm());
    }
  };

  return (
    <div className="form-inline my-2 search">
      <input
        value={searchTerm}
        onChange={onSearchChangeHandler}
        onKeyDown={onSearchTermHandler}
        className="form-control search"
        placeholder="🔍 Search something interesting..."
        aria-label="Search something interesting"
      />
    </div>
  );
}

export default SearchBar;