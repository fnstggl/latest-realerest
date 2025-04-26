
import React from 'react';
import SearchBar from '@/components/SearchBar';
import Navbar from '@/components/Navbar';

const SearchHeader = () => {
  return (
    <>
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 mb-8">
        <SearchBar />
      </div>
    </>
  );
};

export default SearchHeader;
