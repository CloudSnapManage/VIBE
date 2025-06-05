
'use client';

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search as SearchIcon } from 'lucide-react';

const WebSearch: React.FC = () => {
  const [query, setQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      window.open(`https://www.google.com/search?q=${encodeURIComponent(query.trim())}`, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <form onSubmit={handleSearch} className="w-full flex flex-col items-center">
      <div className="flex w-full items-center space-x-2">
        <Input
          type="search"
          placeholder="Search Google or type a URL"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="h-12 text-base bg-input border-input focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 flex-grow"
          aria-label="Web search input"
        />
        <Button type="submit" size="lg" className="h-12 bg-primary hover:bg-primary/90 text-primary-foreground" aria-label="Search">
          <SearchIcon className="h-5 w-5" />
          <span className="ml-2">Search</span>
        </Button>
      </div>
    </form>
  );
};

export default WebSearch;
