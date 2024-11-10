import React, { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import type { SearchFilter } from '../types';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: (filter: SearchFilter) => void;
}

export function SearchBar({ value, onChange, onSearch }: SearchBarProps) {
  const [activeFilter, setActiveFilter] = useState<SearchFilter>('title');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(activeFilter);
  };

  const filters: SearchFilter[] = ['title', 'author', 'subject', 'isbn'];

  return (
    <div className="w-full max-w-3xl space-y-4">
      <form onSubmit={handleSubmit} className="relative">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={`Search by ${activeFilter}...`}
          className="w-full px-4 py-3 pl-12 text-lg rounded-full border-2 border-purple-200 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200 transition-all"
        />
        <Search 
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" 
          size={20} 
        />
        <button
          type="submit"
          className="absolute right-3 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors"
        >
          Search
        </button>
      </form>

      <div className="flex items-center justify-center gap-2">
        <Filter size={16} className="text-gray-500" />
        <div className="flex gap-2">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-3 py-1 rounded-full text-sm transition-colors ${
                activeFilter === filter
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}