import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Loan } from '../types/database';
import toast from 'react-hot-toast';

export function useLoans() {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchLoans() {
    try {
      const { data, error } = await supabase
        .from('loans')
        .select(`
          *,
          items (
            id,
            name,
            status
          ),
          borrower:profiles!loans_borrower_id_fkey (
            id,
            full_name
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLoans(data || []);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch loans';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  const returnItem = async (loanId: string) => {
    try {
      // Start a transaction using RPC
      const { data, error: rpcError } = await supabase
        .rpc('return_item', { loan_id: loanId });

      if (rpcError) throw rpcError;
      
      await fetchLoans(); // Refresh the loans list
      toast.success('Item returned successfully');
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to return item';
      toast.error(message);
      return false;
    }
  };

  useEffect(() => {
    fetchLoans();
  }, []);

  return { loans, loading, error, refetch: fetchLoans, returnItem };
}