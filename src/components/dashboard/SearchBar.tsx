import React, { useState } from 'react';
import { Search, Filter } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onCategoryChange?: (selectedCategories: string[]) => void;
}

export default function SearchBar({ 
  value, 
  onChange, 
  placeholder,
  onCategoryChange 
}: SearchBarProps) {
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [categories] = useState([
    'Electronics',
    'Tools',
    'Laboratory',
    'Audio/Visual',
    'Safety Equipment',
    'Software',
    'Books'
  ]);

  const handleCategoryToggle = (category: string) => {
    const updatedCategories = selectedCategories.includes(category)
      ? selectedCategories.filter(c => c !== category)
      : [...selectedCategories, category];
    
    setSelectedCategories(updatedCategories);
    onCategoryChange?.(updatedCategories);
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    onCategoryChange?.([]);
  };

  return (
    <div className="relative">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-yellow-400" />
          </div>
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="block w-full pl-10 pr-3 py-3 border border-yellow-400 rounded-3xl leading-5 bg-black text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 sm:text-sm"
            placeholder={placeholder}
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="px-4 py-2 border border-yellow-400 rounded-3xl bg-black text-yellow-400 hover:bg-yellow-400 hover:text-black transition-colors relative"
        >
          <Filter className="h-5 w-5" />
          {selectedCategories.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-yellow-400 text-black w-5 h-5 rounded-full text-xs flex items-center justify-center">
              {selectedCategories.length}
            </span>
          )}
        </button>
      </div>
      
      {showFilters && (
        <div className="absolute z-10 mt-2 w-64 right-0 bg-black border border-yellow-400 rounded-lg shadow-lg">
          <div className="p-2">
            <div className="flex justify-between items-center mb-2 pb-2 border-b border-yellow-400">
              <span className="text-white font-medium">Categories</span>
              {selectedCategories.length > 0 && (
                <button
                  onClick={clearFilters}
                  className="text-xs text-yellow-400 hover:text-yellow-300"
                >
                  Clear all
                </button>
              )}
            </div>
            {categories.map((category) => (
              <label key={category} className="flex items-center p-2 hover:bg-gray-900 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(category)}
                  onChange={() => handleCategoryToggle(category)}
                  className="mr-2 rounded border-yellow-400 text-yellow-400 focus:ring-yellow-400"
                />
                <span className="text-white">{category}</span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}