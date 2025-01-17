import React, { useState } from 'react';
import { useInventory } from '../../hooks/useInventory';
import { Plus } from 'lucide-react';
import ItemForm from '../inventory/ItemForm';
import { Item } from '../../types/database';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';

export default function ItemManagement() {
  const { items, loading, error, refetch } = useInventory();
  const [showForm, setShowForm] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  const handleSubmit = async (data: Partial<Item>) => {
    try {
      if (selectedItem) {
        const { error } = await supabase
          .from('items')
          .update(data)
          .eq('id', selectedItem.id);
        if (error) throw error;
        toast.success('Item updated successfully');
      } else {
        const { error } = await supabase
          .from('items')
          .insert([{ ...data, qr_code: `item-${Date.now()}` }]);
        if (error) throw error;
        toast.success('Item created successfully');
      }
      refetch();
      setShowForm(false);
    } catch (err) {
      toast.error('Failed to save item');
    }
  };

  if (loading) return <div>Loading items...</div>;
  if (error) return <div>Error loading items: {error}</div>;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Item Management</h2>
        <button
          onClick={() => {
            setSelectedItem(null);
            setShowForm(true);
          }}
          className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Item
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {items.map((item) => (
              <tr key={item.id}>
                <td className="px-4 py-3 text-sm text-gray-900">{item.name}</td>
                <td className="px-4 py-3 text-sm">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    item.status === 'available' ? 'bg-green-100 text-green-800' :
                    item.status === 'borrowed' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {item.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm">
                  <button
                    onClick={() => {
                      setSelectedItem(item);
                      setShowForm(true);
                    }}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showForm && (
        <ItemForm
          item={selectedItem || undefined}
          onSubmit={handleSubmit}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  );
}