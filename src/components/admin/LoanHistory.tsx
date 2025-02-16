import React from 'react';
import { useLoans } from '../../hooks/useLoans';
import { format } from 'date-fns';
import LoadingSpinner from '../LoadingSpinner';
import SearchBar from '../../components/inventory/SearchBar';
import { useState } from 'react';

interface LoanHistoryProps {
  showReturned?: boolean;
}

export default function LoanHistory({ showReturned = false }: LoanHistoryProps) {
  const { loans, loading, error } = useLoans();
  const [searchQuery, setSearchQuery] = useState('');
  const ROWS_PER_PAGE = 5; // Default number of rows to show

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-red-600">Error: {error}</div>;

  const filteredLoans = loans.filter(loan => 
    loan.status === (showReturned ? 'returned' : 'active') &&
    (loan.items?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    loan.borrower?.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    loan.project_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    loan.course_details?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Show all filtered loans if there's a search query, otherwise limit to ROWS_PER_PAGE
  const displayedLoans = searchQuery ? filteredLoans : filteredLoans.slice(0, ROWS_PER_PAGE);

  return (
    <div className="p-6">
      <div className="flex flex-col space-y-4 mb-6">
        <div className="max-w-md">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search by item, borrower, or project..."
          />
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Item</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Borrower</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Project</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Borrow Date</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                {showReturned ? 'Return Date' : 'Due Date'}
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {displayedLoans.map((loan) => (
              <tr key={loan.id}>
                <td className="px-4 py-3 text-sm text-gray-900">
                  {loan.items?.name}
                </td>
                <td className="px-4 py-3">
                  <div className="text-sm text-gray-900">{loan.borrower?.full_name}</div>
                  <div className="text-xs text-gray-500">{loan.borrower?.student_id}</div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-500">
                  {loan.borrower?.department || '-'}
                </td>
                <td className="px-4 py-3">
                  {loan.project_name && (
                    <div className="text-sm text-gray-900">{loan.project_name}</div>
                  )}
                  {loan.course_details && (
                    <div className="text-xs text-gray-500">{loan.course_details}</div>
                  )}
                </td>
                <td className="px-4 py-3 text-sm text-gray-500">
                  {format(new Date(loan.borrow_date), 'MMM d, yyyy')}
                </td>
                <td className="px-4 py-3 text-sm text-gray-500">
                  {showReturned 
                    ? format(new Date(loan.actual_return_date || ''), 'MMM d, yyyy')
                    : format(new Date(loan.expected_return_date), 'MMM d, yyyy')}
                </td>
                <td className="px-4 py-3 text-sm">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    showReturned
                      ? 'bg-green-100 text-green-800'
                      : new Date(loan.expected_return_date) < new Date()
                        ? 'bg-red-100 text-red-800'
                        : 'bg-blue-100 text-blue-800'
                  }`}>
                    {showReturned 
                      ? 'Returned' 
                      : new Date(loan.expected_return_date) < new Date() 
                        ? 'Overdue' 
                        : 'Active'}
                  </span>
                </td>
              </tr>
            ))}
            {displayedLoans.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                  {searchQuery 
                    ? `No ${showReturned ? 'returned' : 'active'} loans match your search`
                    : `No ${showReturned ? 'returned' : 'active'} loans`}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {!searchQuery && filteredLoans.length > ROWS_PER_PAGE && (
        <div className="mt-4 text-center text-sm text-gray-500">
          Showing {ROWS_PER_PAGE} of {filteredLoans.length} {showReturned ? 'returned' : 'active'} loans. Use search to see more.
        </div>
      )}
    </div>
  );
}