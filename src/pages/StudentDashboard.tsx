import React, { useEffect, useState } from 'react';
import { useInventory } from '../hooks/useInventory';
import { useLoans } from '../hooks/useLoans';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import SearchBar from '../components/dashboard/SearchBar';
import ItemList from '../components/dashboard/ItemList';
import LoadingSpinner from '../components/LoadingSpinner';
import { format } from 'date-fns';
import { Package, Clock, AlertCircle } from 'lucide-react';
import BorrowButton from '../components/dashboard/BorrowButton';

export default function StudentDashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const { theme } = useTheme();
  const { items, loading: itemsLoading, error: itemsError, refetch: refetchItems } = useInventory();
  const { loans, loading: loansLoading, returnItem } = useLoans();
  const { user } = useAuth();

  useEffect(() => {
    refetchItems();
  }, [loans]);

  if (itemsLoading || loansLoading) return <LoadingSpinner />;
  if (itemsError) return <div className="text-red-600">Error: {itemsError}</div>;

  const myActiveLoans = loans.filter(
    loan => loan.borrower_id === user?.id && loan.status === 'active'
  );

  const availableItems = items.filter(item =>
    item.status === 'available' &&
    (searchQuery === '' || 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location?.toLowerCase().includes(searchQuery.toLowerCase())) &&
    (selectedCategories.length === 0 || 
      item.categories?.name && selectedCategories.includes(item.categories.name))
  );

  const overdueLoans = myActiveLoans.filter(loan =>
    new Date(loan.expected_return_date) < new Date()
  );

  const handleReturnItem = async (loanId: string) => {
    const success = await returnItem(loanId);
    if (success) {
      refetchItems();
    }
  };

  return (
    <div className={`space-y-8 ${theme}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-black dark:text-white">
            Student Dashboard
          </h1>
        </div>
        <BorrowButton />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-400">Active Loans</p>
              <p className="mt-2 text-3xl font-semibold text-black dark:text-white">{myActiveLoans.length}</p>
            </div>
            <Package className="w-8 h-8 text-yellow-400" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-400">Available Items</p>
              <p className="mt-2 text-3xl font-semibold text-black dark:text-white">{availableItems.length}</p>
            </div>
            <Clock className="w-8 h-8 text-yellow-400" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-400">Overdue Items</p>
              <p className="mt-2 text-3xl font-semibold text-black dark:text-white">{overdueLoans.length}</p>
            </div>
            <AlertCircle className="w-8 h-8 text-yellow-400" />
          </div>
        </div>
      </div>

      {/* Active Loans Section */}
      {myActiveLoans.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4 text-black dark:text-white">My Active Loans</h2>
          <div className="space-y-4">
            {myActiveLoans.map(loan => (
              <div key={loan.id} className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div>
                  <p className="font-medium text-black dark:text-white">{loan.items?.name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-300">
                    Due: {format(new Date(loan.expected_return_date), 'MMM d, yyyy')}
                  </p>
                  {loan.project_name && (
                    <p className="text-sm text-gray-500 dark:text-gray-300">Project: {loan.project_name}</p>
                  )}
                </div>
                <div className="flex items-center space-x-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    new Date(loan.expected_return_date) < new Date()
                      ? 'bg-red-100 text-red-800 dark:bg-red-300 dark:text-red-900'
                      : 'bg-blue-100 text-blue-800 dark:bg-blue-300 dark:text-blue-900'
                  }`}>
                    {new Date(loan.expected_return_date) < new Date() ? 'Overdue' : 'Active'}
                  </span>
                  <button
                    onClick={() => handleReturnItem(loan.id)}
                    className="px-3 py-1 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 dark:hover:bg-green-500"
                  >
                    Return
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Available Items Section */}
      <div className="space-y-6">
        <div className="flex flex-col space-y-4">
          <h2 className="text-2xl font-bold text-black dark:text-white">Available Items</h2>
          <div className="max-w-xl">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              onCategoryChange={setSelectedCategories}
              placeholder="Search by name, description, location..."
            />
          </div>
        </div>
        {searchQuery.trim() || selectedCategories.length > 0 ? (
          availableItems.length > 0 ? (
            <ItemList items={availableItems} />
          ) : (
            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-md">
              <p className="text-black dark:text-gray-300">No items available matching your search criteria.</p>
            </div>
          )
        ) : (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <p className="text-gray-500 dark:text-gray-300">
              Start searching to see available items.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}