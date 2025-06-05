
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
    <form onSubmit={handleSearch} className="w-full max-w-lg flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2">
      <Input
        type="search"
        placeholder="Search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="h-10 text-sm bg-input border-input focus-visible:ring-primary flex-grow w-full"
        aria-label="Web search"
      />
      <Button type="submit" size="default" className="h-10 bg-primary hover:bg-primary/90 text-primary-foreground px-4 w-full sm:w-auto">
        <SearchIcon className="h-4 w-4 mr-2" />
        Search
      </Button>
    </form>
  );
};

export default WebSearch;
