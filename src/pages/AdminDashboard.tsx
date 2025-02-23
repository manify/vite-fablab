import React from 'react';
import { Package, Users, AlertCircle } from 'lucide-react';
import { useStats } from '../hooks/useStats';
import LoanHistory from '../components/admin/LoanHistory';
import LoadingSpinner from '../components/LoadingSpinner';

export default function AdminDashboard() {
  const { totalItems, availableItems, activeLoans, loading: statsLoading, error: statsError } = useStats();

  if (statsLoading) return <LoadingSpinner />;
  if (statsError) return <div className="text-red-600">Error: {statsError}</div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
         
          <h1 className="text-2xl font-bold text-black dark:text-white">Admin Dashboard</h1>
        </div>
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

      {/* Active Loans Section */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold">Active Loans</h2>
        </div>
        <LoanHistory />
      </div>

      {/* Loan History Section */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold">Loan History</h2>
        </div>
        <div className="p-6">
          <LoanHistory showReturned={true} />
        </div>
      </div>
    </div>
  );
}