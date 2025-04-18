
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
    <form onSubmit={handleSearch} className={`relative w-full max-w-3xl ${className} group`}>
      <div className="relative flex w-full before:absolute before:-inset-1 before:rounded-xl before:opacity-0 group-hover:before:opacity-100 before:transition-opacity before:duration-300 before:bg-gradient-to-r before:from-[#3C79F5] before:via-[#D946EF] before:to-[#FF3CAC] before:blur-lg before:-z-10">
        <input
          type="text"
          placeholder="Search by city, address, or zip code..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full px-6 py-4 text-lg glass-input text-foreground focus:outline-none rounded-xl bg-white/75 backdrop-blur-sm border border-white/20 transition-all duration-300 group-hover:border-transparent relative z-10"
        />
      </div>
    </form>
  );
};

export default SearchBar;
