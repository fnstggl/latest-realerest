
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface SearchBarProps {
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ className = "" }) => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      console.log('Searching for:', query);
      navigate(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className={`searchbar-isolated relative w-full max-w-3xl ${className} group`}>
      <div className="relative flex w-full">
        <input
          type="text"
          placeholder="Search by city, address, or zip code..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full px-4 sm:px-6 py-3 sm:py-4 text-[0.625rem] text-[#a8a8a8] placeholder-[#a8a8a8] bg-[#fafcfe] border border-transparent outline outline-[3px] outline-[#01204b] outline-offset-[1.5px] rounded-xl shadow-none font-bold font-inter relative z-10 focus:outline-[#01204b] focus:text-[#737a87] transition-all duration-300"
        />
      </div>
    </form>
  );
};

export default SearchBar;
