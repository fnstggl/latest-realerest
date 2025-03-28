
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from 'lucide-react';

interface SearchBarProps {
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ className = "" }) => {
  const [query, setQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search logic will go here when connected to a database
    console.log('Searching for:', query);
    window.location.href = `/search?q=${encodeURIComponent(query)}`;
  };

  return (
    <form onSubmit={handleSearch} className={`relative w-full max-w-3xl ${className}`}>
      <div className="relative flex w-full">
        <Input
          type="text"
          placeholder="Search by city, address, or zip code..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pr-16 h-14 rounded-lg border-2 border-gray-200 focus:border-donedeal-orange shadow-sm"
        />
        <Button 
          type="submit" 
          size="icon" 
          className="absolute right-1 top-1/2 -translate-y-1/2 bg-donedeal-orange hover:bg-donedeal-orange/90 h-10 w-10 rounded-lg"
        >
          <Search size={20} />
        </Button>
      </div>
    </form>
  );
};

export default SearchBar;
