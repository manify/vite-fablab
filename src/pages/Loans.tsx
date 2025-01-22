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

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg text-gray-500 animate-pulse">Loading...</p>
      </div>
    );
  if (error)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg text-red-500">Error: {error}</p>
      </div>
    );

  const activeLoans = loans.filter((loan) => loan.status === 'active');
  const returnedLoans = loans.filter((loan) => loan.status === 'returned');

  return (
    <div className="p-6 space-y-12 bg-white min-h-screen">
      <section>
        <h2 className="text-2xl font-bold text-black border-b-4 border-yellow-400 pb-2 mb-6">
          Active Loans
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeLoans.map((loan) => (
            <LoanCard key={loan.id} loan={loan} onReturn={handleReturn} />
          ))}
          {activeLoans.length === 0 && (
            <p className="text-gray-500 text-center col-span-full">
              No active loans
            </p>
          )}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-black border-b-4 border-yellow-400 pb-2 mb-6">
          Loan History
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {returnedLoans.map((loan) => (
            <LoanCard key={loan.id} loan={loan} />
          ))}
          {returnedLoans.length === 0 && (
            <p className="text-gray-500 text-center col-span-full">
              No loan history
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
