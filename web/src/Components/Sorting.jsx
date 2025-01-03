import React from 'react';

const Sorting = ({ onSort, currentSort, onCategoryChange, selectedCategory }) => {
    return (
        <div className="mb-4 d-flex justify-content-center">
            <select 
                className="form-select me-2" 
                onChange={(e) => onCategoryChange(e.target.value)} 
                value={selectedCategory} // Set value for category select
            >
                <option value="">Select Category</option>
                <option value="All">All</option>
                <option value="men's clothing">Men's Clothing</option>
                <option value="women's clothing">Women's Clothing</option>
                <option value="jewelery">Jewelery</option>
                <option value="electronics">Electronics</option>
            </select>
            <select 
                className="form-select" 
                onChange={(e) => onSort(e.target.value)} 
                value={currentSort} // Set value for sort select
            >
                <option value="">Sort by</option>
                <option value="lowToHigh">Price: Low to High</option>
                <option value="highToLow">Price: High to Low</option>
            </select>
        </div>
    );
};

export default Sorting;
