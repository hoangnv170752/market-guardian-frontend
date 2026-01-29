'use client';

import { Icon } from '@iconify/react';
import { useState } from 'react';

interface SearchBarProps {
  placeholder?: string;
  onSearch?: (value: string) => void;
}

export const SearchBar = ({ placeholder = 'Search', onSearch }: SearchBarProps) => {
  const [searchValue, setSearchValue] = useState('');

  const handleSearch = () => {
    if (onSearch) {
      onSearch(searchValue);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="flex items-center gap-3 bg-white">
      <div className="relative flex-1">
        <input
          type="text"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          className="w-full rounded-lg border border-gray-300 px-4 py-2 pr-10 text-sm focus:border-primary-main focus:outline-none focus:ring-1 focus:ring-primary-main"
        />
        <Icon
          icon="mdi:magnify"
          className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
        />
      </div>
      <button
        onClick={handleSearch}
        className="flex items-center gap-2 rounded-lg bg-[#5CB85C] px-6 py-2 text-sm font-medium text-white hover:bg-[#4CAF50]"
      >
        Search
      </button>
    </div>
  );
};
