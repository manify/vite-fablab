import React from 'react';
import { useLoans } from '../hooks/useLoans';
import LoanCard from '../components/loans/LoanCard';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';
import { Loan } from '../types/database';

export default function Loans() {
  const { loans, loading, error, refetch } = useLoans();

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

  const activeLoans = loans.filter(loan => loan.status === 'active');
  const returnedLoans = loans.filter(loan => loan.status === 'returned');

  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Active Loans</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {activeLoans.map(loan => (
            <LoanCard 
              key={loan.id} 
              loan={loan}
              onReturn={handleReturn}
            />
          ))}
          {activeLoans.length === 0 && (
            <p className="text-gray-500">No active loans</p>
          )}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Loan History</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {returnedLoans.map(loan => (
            <LoanCard key={loan.id} loan={loan} />
          ))}
          {returnedLoans.length === 0 && (
            <p className="text-gray-500">No loan history</p>
          )}
        </div>
      </section>
    </div>
  );
}