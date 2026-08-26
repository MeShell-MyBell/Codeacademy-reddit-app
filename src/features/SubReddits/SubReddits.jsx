import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import {
  selectSubReddits,
  loadSubReddits,
} from './SubRedditsSlice';

import 'bootstrap/dist/css/bootstrap.min.css';
import './SubReddits.css';

const SubReddits = () => {
  const subReddits = useSelector(selectSubReddits);
  const dispatch = useDispatch();

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    dispatch(loadSubReddits());
  }, [dispatch]);

  const onClick = () => {
    window.scrollTo(0, 0);
    setIsOpen(false);
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="btn-group btn-subreddit">
      <Link className="d-none d-md-inline" to="/popular">
        <button
          type="button"
          className="btn btn-orange"
          onClick={onClick}
        >
          Popular
        </button>
      </Link>

      <button
        type="button"
        className="btn dropdown-toggle dropdown-toggle-split btn-orange"
        onClick={toggleDropdown}
        aria-expanded={isOpen}
      >
        <span className="sr-only">Toggle Dropdown</span>
      </button>

      {isOpen && (
        <div className="dropdown-menu show py-0">
          {subReddits.map((subReddit) => (
            <Link
              className="dropdown-item py-2"
              to={`/${subReddit.display_name}`}
              key={subReddit.id}
              onClick={onClick}
            >
              {subReddit.name}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default SubReddits;