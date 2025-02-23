import React, { useState } from 'react';
import { useLoans } from '../hooks/useLoans';
import LoanCard from '../components/loans/LoanCard';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';
import { Loan } from '../types/database';
import SearchBar from '../components/inventory/SearchBar';

export default function Loans() {
  const { loans, loading, error, refetch } = useLoans();
  const [activeSearchQuery, setActiveSearchQuery] = useState('');
  const [historySearchQuery, setHistorySearchQuery] = useState('');
  const ITEMS_PER_PAGE = 5; // Default number of items to show

  const handleReturn = async (loan: Loan) => {
    try {
      const { error: updateError } = await supabase
        .from('loans')
        .update({
          status: 'returned',
          actual_return_date: new Date().toISOString(),
        })
        .eq('id', loan.id);

      if (updateError) throw updateError;
      
      toast.success('Item returned successfully');
      refetch();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to return item');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const filterLoans = (loans: Loan[], query: string) => {
    return loans.filter(loan => 
      loan.items?.name.toLowerCase().includes(query.toLowerCase()) ||
      loan.borrower?.full_name.toLowerCase().includes(query.toLowerCase()) ||
      loan.project_name?.toLowerCase().includes(query.toLowerCase()) ||
      loan.course_details?.toLowerCase().includes(query.toLowerCase())
    );
  };

  const activeLoans = loans.filter(loan => loan.status === 'active');
  const returnedLoans = loans.filter(loan => loan.status === 'returned');

  const filteredActiveLoans = filterLoans(activeLoans, activeSearchQuery);
  const filteredReturnedLoans = filterLoans(returnedLoans, historySearchQuery);

  // Show all filtered loans if there's a search query, otherwise limit to ITEMS_PER_PAGE
  const displayedActiveLoans = activeSearchQuery ? filteredActiveLoans : filteredActiveLoans.slice(0, ITEMS_PER_PAGE);
  const displayedReturnedLoans = historySearchQuery ? filteredReturnedLoans : filteredReturnedLoans.slice(0, ITEMS_PER_PAGE);

  return (
    <div className="space-y-8">
      <section>
        <div className="flex flex-col space-y-4 mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Active Loans</h2>
          <div className="max-w-md">
            <SearchBar
              value={activeSearchQuery}
              onChange={setActiveSearchQuery}
              placeholder="Search active loans by item, borrower, or project..."
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {displayedActiveLoans.map(loan => (
            <LoanCard 
              key={loan.id} 
              loan={loan}
              onReturn={handleReturn}
            />
          ))}
          {displayedActiveLoans.length === 0 && (
            <p className="text-gray-500">
              {activeSearchQuery ? 'No active loans match your search' : 'No active loans'}
            </p>
          )}
        </div>
        {!activeSearchQuery && filteredActiveLoans.length > ITEMS_PER_PAGE && (
          <div className="mt-4 text-center text-sm text-gray-500">
            Showing {ITEMS_PER_PAGE} of {filteredActiveLoans.length} active loans. Use search to see more.
          </div>
        )}
      </section>

      <section>
        <div className="flex flex-col space-y-4 mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Loan History</h2>
          <div className="max-w-md">
            <SearchBar
              value={historySearchQuery}
              onChange={setHistorySearchQuery}
              placeholder="Search loan history by item, borrower, or project..."
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {displayedReturnedLoans.map(loan => (
            <LoanCard 
              key={loan.id} 
              loan={loan}
              className="bg-black text-white"
            />
          ))}
          {displayedReturnedLoans.length === 0 && (
            <p className="text-gray-500">
              {historySearchQuery ? 'No loan history matches your search' : 'No loan history'}
            </p>
          )}
        </div>
        {!historySearchQuery && filteredReturnedLoans.length > ITEMS_PER_PAGE && (
          <div className="mt-4 text-center text-sm text-gray-500">
            Showing {ITEMS_PER_PAGE} of {filteredReturnedLoans.length} returned loans. Use search to see more.
          </div>
        )}
      </section>
    </div>
  );
}