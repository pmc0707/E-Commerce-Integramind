// SearchBar.jsx
import React from 'react';
import './SearchandSort.css';

const SearchBar = ({ searchQuery, onSearch }) => {
    return (
        <input 
            type="text" 
            placeholder="Search products..." 
            value={searchQuery} 
            onChange={onSearch} 
            className="form-control mb-4"
        />
    );
};

export default SearchBar;
