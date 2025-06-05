
'use client';

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search as SearchIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

const WebSearch: React.FC = () => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      window.open(`https://www.google.com/search?q=${encodeURIComponent(query.trim())}`, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="w-full max-w-lg flex flex-col items-center">
      <p className="text-xs text-muted-foreground mb-1.5 self-start ml-1">Search in web</p>
      <form onSubmit={handleSearch} className="w-full flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2">
        <div
          className={cn(
            'search-input-outer-wrapper w-full flex-grow transition-all duration-300 ease-out',
            isFocused ? 'is-focused-wrapper' : ''
          )}
        >
          <Input
            type="search"
            placeholder="Search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="search-input-field-animated h-10 text-sm w-full"
            aria-label="Web search"
          />
        </div>
        <Button type="submit" size="default" className="h-10 bg-primary hover:bg-primary/90 text-primary-foreground px-4 w-full sm:w-auto">
          <SearchIcon className="h-4 w-4 mr-2" />
          Search
        </Button>
      </form>
    </div>
  );
};

export default WebSearch;
