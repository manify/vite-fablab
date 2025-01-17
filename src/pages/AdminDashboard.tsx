import React, { useState } from 'react';
import { Package, Users, AlertCircle, Plus } from 'lucide-react';
import { useStats } from '../hooks/useStats';
import { useInventory } from '../hooks/useInventory';
import LoanHistory from '../components/admin/LoanHistory';
import ItemForm from '../components/inventory/ItemForm';
import LoadingSpinner from '../components/LoadingSpinner';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';
import { Item } from '../types/database';

export default function AdminDashboard() {
  const { totalItems, availableItems, activeLoans, loading: statsLoading, error: statsError } = useStats();
  const { refetch: refetchItems } = useInventory();
  const [showItemForm, setShowItemForm] = useState(false);

  const handleAddItem = async (data: Partial<Item>) => {
    try {
      const { error } = await supabase
        .from('items')
        .insert([{ ...data, qr_code: `item-${Date.now()}` }]);

      if (error) throw error;
      toast.success('Item added successfully');
      refetchItems();
      setShowItemForm(false);
    } catch (err) {
      toast.error('Failed to add item');
      console.error('Error adding item:', err);
    }
  };

  if (statsLoading) return <LoadingSpinner />;
  if (statsError) return <div className="text-red-600">Error: {statsError}</div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <img 
            src="/src/images/logo.png" 
            alt="Lab'CESI Logo" 
            className="w-14 h-auto"
          />
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        </div>
        <button
          onClick={() => setShowItemForm(true)}
          className="flex items-center px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add New Item
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-black text-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-400">Total Items</p>
              <p className="mt-2 text-3xl font-semibold">{totalItems}</p>
            </div>
            <Package className="w-8 h-8 text-yellow-400" />
          </div>
        </div>

        <div className="bg-black text-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-400">Active Loans</p>
              <p className="mt-2 text-3xl font-semibold">{activeLoans}</p>
            </div>
            <Users className="w-8 h-8 text-yellow-400" />
          </div>
        </div>

        <div className="bg-black text-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-400">Available Items</p>
              <p className="mt-2 text-3xl font-semibold">{availableItems}</p>
            </div>
            <AlertCircle className="w-8 h-8 text-yellow-400" />
          </div>
        </div>
      </div>

      {/* Recent Loans Table */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold">Recent Loans</h2>
        </div>
        <LoanHistory />
      </div>

      {/* Add Item Modal */}
      {showItemForm && (
        <ItemForm
          onSubmit={handleAddItem}
          onClose={() => setShowItemForm(false)}
        />
      )}
    </div>
  );
}