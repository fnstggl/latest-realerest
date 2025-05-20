import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GlowEffect } from '@/components/ui/glow-effect';

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
      <div className="relative w-full rounded-xl border-[3px] border-[#76818f] bg-[#fafcfe]">
        <input
          type="text"
          placeholder="Search by city, address, or zip code..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full px-4 sm:px-6 py-3 sm:py-4 text-[0.625rem] text-[#a8a8a8] placeholder-[#a8a8a8] bg-transparent outline-none border-none font-bold font-inter rounded-xl"
        />
        <GlowEffect
          colors={['#3C79F5', '#6C42F5', '#D946EF', '#FF5C00', '#FF3CAC']}
          mode="flowHorizontal"
          blur="soft"
          scale={1}
          className="opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-300 absolute inset-0 rounded-xl pointer-events-none"
        />
      </div>
    </form>
  );
};

export default SearchBar;