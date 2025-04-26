
import React from 'react';

const SearchFooter = () => {
  return (
    <footer className="bg-white py-10 border-t border-gray-200 mt-8">
      <div className="container px-4 lg:px-8 mx-auto text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} DoneDeal. All rights reserved.
      </div>
    </footer>
  );
};

export default SearchFooter;
