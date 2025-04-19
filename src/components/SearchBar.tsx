
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
      <div className="relative flex w-full">
        {/* Input field */}
        <input
          type="text"
          placeholder="Search by city, address, or zip code..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full px-6 py-4 text-lg glass-input text-foreground rounded-xl bg-white backdrop-blur-sm border-transparent transition-all duration-300 relative z-10 focus:outline-none focus:ring-0 focus:border-transparent"
        />
        
        {/* Custom glow effect that doesn't rely on the GlowEffect component */}
        <div 
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl pointer-events-none overflow-hidden"
          style={{
            background: 'linear-gradient(90deg, #3C79F5, #6C42F5 20%, #D946EF 40%, #FF5C00 60%, #FF3CAC 80%)',
            padding: '2px',
            margin: '-2px',
            filter: 'blur(8px)',
          }}
        ></div>
      </div>
    </form>
  );
};

export default SearchBar;
