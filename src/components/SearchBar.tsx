
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';

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

  const handleButtonClick = () => {
    if (query.trim()) {
      console.log('Searching for:', query);
      navigate(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className={`searchbar-isolated relative w-full max-w-3xl ${className} group`}>
      <div className="relative flex w-full">
        <button
          type="button"
          onClick={handleButtonClick}
          className="absolute left-3 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-[#fd4801] rounded-full flex items-center justify-center z-10 hover:shadow-[0_0_0_2px_#fd4801] transition-shadow duration-300"
        >
          <Search className="w-5 h-5 text-white" />
        </button>
        <input
          type="text"
          placeholder="Search for your dream home"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-16 pr-6 py-3 sm:py-4 text-[0.875rem] bg-white border border-[#cdcdcd] rounded-full shadow-none font-polysans-semibold placeholder:text-[#ababab] placeholder:font-polysans-semibold focus:outline-none focus:border-[#cdcdcd] text-[#737a87] transition-all duration-300"
        />
      </div>
    </form>
  );
};

export default SearchBar;
