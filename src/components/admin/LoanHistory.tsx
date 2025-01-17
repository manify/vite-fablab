import React from 'react';
import { useLoans } from '../../hooks/useLoans';
import { format } from 'date-fns';
import LoadingSpinner from '../LoadingSpinner';

export default function LoanHistory() {
  const { loans, loading, error } = useLoans();

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-red-600">Error: {error}</div>;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-lg font-semibold mb-4">Loan History</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Item</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Borrow Date</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Expected Return</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loans.map((loan) => (
              <tr key={loan.id}>
                <td className="px-4 py-3 text-sm text-gray-900">
                  {loan.items?.name}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900">
                  {loan.borrower?.full_name}
                </td>
                <td className="px-4 py-3 text-sm text-gray-500">
                  {format(new Date(loan.borrow_date), 'MMM d, yyyy')}
                </td>
                <td className="px-4 py-3 text-sm text-gray-500">
                  {format(new Date(loan.expected_return_date), 'MMM d, yyyy')}
                </td>
                <td className="px-4 py-3 text-sm">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    loan.status === 'active' 
                      ? new Date(loan.expected_return_date) < new Date()
                        ? 'bg-red-100 text-red-800'
                        : 'bg-blue-100 text-blue-800'
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {loan.status === 'active'
                      ? new Date(loan.expected_return_date) < new Date()
                        ? 'Overdue'
                        : 'Active'
                      : 'Returned'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}