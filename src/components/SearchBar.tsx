
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
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

  return (
    <form onSubmit={handleSearch} className={`relative w-full max-w-3xl ${className}`}>
      <div className="relative flex w-full layer-2">
        <input
          type="text"
          placeholder="Search by city, address, or zip code..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full px-6 py-4 text-lg bg-white/20 border border-white/30 text-foreground focus:outline-none rounded-xl backdrop-blur-md shadow-lg"
        />
        <Button 
          type="submit" 
          variant="glass"
          className="absolute right-3 top-1/2 -translate-y-1/2 text-white font-bold h-10 w-10 flex items-center justify-center rounded-full bg-white/30 border border-white/30 search-glow shadow-md backdrop-blur-md transform hover:translate-y-[-2px] transition-all layer-3"
        >
          <Search className="h-5 w-5 text-[var(--purple-primary)]" />
        </Button>
      </div>
    </form>
  );
};

export default SearchBar;
