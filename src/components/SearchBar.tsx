
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
    <div className="relative flex w-full items-center">
      <input
        type="text"
        placeholder="Search for your dream home"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full pl-16 pr-6 py-4 text-[0.875rem] bg-white border border-[#cdcdcd] rounded-full shadow-none font-polysans-semibold placeholder:text-[#ababab] placeholder:font-polysans placeholder:font-semibold focus:outline-none focus:border-[#cdcdcd] text-[#737a87] transition-all duration-300 group-hover:shadow-[0_0_0_2px_rgba(253,72,1,0.2)]"
      />
      <button
        type="submit"
        className="absolute left-2 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-[#fd4801] hover:bg-[#e54001] rounded-full flex items-center justify-center transition-all duration-300 hover:shadow-[0_0_0_2px_rgba(253,72,1,0.3)]"
      >
        <svg 
          width="20" 
          height="20" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="white" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8"></circle>
          <path d="m21 21-4.35-4.35"></path>
        </svg>
      </button>
    </div>
  </form>
);


export default SearchBar;
