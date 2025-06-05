'use client';

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

const WebSearch: React.FC = () => {
  const [query, setQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      window.open(`https://www.google.com/search?q=${encodeURIComponent(query.trim())}`, '_blank');
    }
  };

  return (
    <form onSubmit={handleSearch} className="w-full max-w-md flex flex-col items-center gap-4">
      <h2 className="text-2xl font-semibold text-foreground mb-4 font-headline">Search the Web</h2>
      <div className="flex w-full items-center space-x-2">
        <Input
          type="search"
          placeholder="Search Google or type a URL"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="h-12 text-lg bg-input border-border focus:ring-accent focus:border-accent"
          aria-label="Web search input"
        />
        <Button type="submit" size="lg" className="h-12 bg-primary hover:bg-primary/90 text-primary-foreground" aria-label="Search">
          <Search className="mr-2 h-5 w-5" /> Search
        </Button>
      </div>
      <p className="text-xs text-muted-foreground mt-2">
        Press Enter to search. Results will open in a new tab.
      </p>
    </form>
  );
};

export default WebSearch;
