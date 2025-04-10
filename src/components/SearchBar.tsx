
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
      <div className="relative flex w-full">
        <input
          type="text"
          placeholder="Search by city, address, or zip code..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full px-6 py-4 text-lg border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:ring-0"
        />
        <Button 
          type="submit" 
          className="absolute right-3 top-1/2 -translate-y-1/2 bg-[#d0161a] hover:bg-[#d0161a]/90 text-white font-bold h-10 w-10 border-2 border-black flex items-center justify-center"
        >
          <Search className="h-5 w-5" />
        </Button>
      </div>
    </form>
  );
};

export default SearchBar;
