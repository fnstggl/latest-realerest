
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GlowEffect } from '@/components/ui/glow-effect';
import { Search } from 'lucide-react';

interface SearchBarProps {
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ className = "" }) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      console.log('Searching for:', query);
      navigate(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className={`relative w-full max-w-3xl ${className} group`}>
      <div className="relative flex w-full">
        <div className="relative w-full">
          <input
            type="text"
            placeholder="Search by city, address, or zip code..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="w-full px-4 sm:px-6 py-3 sm:py-4 text-[0.625rem] text-[#a8a8a8] placeholder-[#a8a8a8] bg-[#fafcfe] border border-transparent outline outline-[3px] outline-[#76818f] outline-offset-[1.5px] rounded-xl shadow-none font-bold font-inter relative z-10 focus:outline-[#76818f] focus:text-[#737a87] transition-all duration-300 search-bar-focus"
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 z-10 text-[#a8a8a8]">
            <Search size={16} />
          </div>
        </div>
        <GlowEffect
          colors={['#3C79F5', '#6C42F5', '#D946EF', '#FF5C00', '#FF3CAC']}
          mode="flowHorizontal"
          blur="soft"
          scale={1}
          className={`${isFocused ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity duration-300 absolute inset-0 rounded-xl pointer-events-none`}
        />
      </div>
    </form>
  );
};

export default SearchBar;
