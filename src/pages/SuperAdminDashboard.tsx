import React from 'react';
import UserList from '../components/admin/UserList';
import { Package, Users, AlertCircle } from 'lucide-react';
import { useStats } from '../hooks/useStats';
import LoadingSpinner from '../components/LoadingSpinner';

export default function SuperAdminDashboard() {
  const { totalItems, availableItems, activeLoans, loading, error } = useStats();

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-red-600">Error: {error}</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4 mb-6">
        <img 
          src="/src/images/logo.png" 
          alt="Lab'CESI Logo" 
          className="w-14 h-auto"
        />
        <h1 className="text-2xl font-bold">Super Admin Dashboard</h1>
      </div>

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
              <p className="text-sm font-medium text-yellow-400">Active Users</p>
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

      <div className="mt-8">
        <UserList />
      </div>
    </div>
  );
}