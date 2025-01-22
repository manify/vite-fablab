import React from 'react';
import UserList from '../components/admin/UserList';
import { Package, Users, AlertCircle } from 'lucide-react';
import { useStats } from '../hooks/useStats';
import LoadingSpinner from '../components/LoadingSpinner';
import { useTheme } from '../contexts/ThemeContext';

export default function SuperAdminDashboard() {
  const { totalItems, availableItems, activeLoans, loading, error } = useStats();
  const { theme } = useTheme();

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-red-600">Error: {error}</div>;

  return (
    <div className={`space-y-8 ${theme}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-black dark:text-white">Super Admin Dashboard</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-400">Total Items</p>
              <p className="mt-2 text-3xl font-semibold text-black dark:text-white">{totalItems}</p>
            </div>
            <Package className="w-8 h-8 text-yellow-400" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-400">Active Users</p>
              <p className="mt-2 text-3xl font-semibold text-black dark:text-white">{activeLoans}</p>
            </div>
            <Users className="w-8 h-8 text-yellow-400" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-400">Available Items</p>
              <p className="mt-2 text-3xl font-semibold text-black dark:text-white">{availableItems}</p>
            </div>
            <AlertCircle className="w-8 h-8 text-yellow-400" />
          </div>
        </div>
      </div>

      {/* User List Section */}
      <div className="mt-8">
        <UserList />
      </div>
    </div>
  );
}
