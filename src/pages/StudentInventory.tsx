import React, { useState } from 'react';
import { useInventory } from '../hooks/useInventory';
import SearchBar from '../components/inventory/SearchBar';
import ItemList from '../components/dashboard/ItemList';
import LoadingSpinner from '../components/LoadingSpinner';

export default function StudentInventory() {
  const [searchQuery, setSearchQuery] = useState('');
  const { items, loading, error } = useInventory();

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-red-600">Error: {error}</div>;

  const filteredItems = items.filter(item =>
    (item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.categories?.name.toLowerCase().includes(searchQuery.toLowerCase())) &&
    item.status === 'available'
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4">
        <h1 className="text-2xl font-bold text-gray-900">Available Items</h1>
        <div className="max-w-xl">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search available items..."
          />
        </div>
      </div>
      <ItemList items={filteredItems} />
    </div>
  );
}