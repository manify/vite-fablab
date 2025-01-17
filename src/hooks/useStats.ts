import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Item, Loan } from '../types/database';

interface Stats {
  totalItems: number;
  availableItems: number;
  activeLoans: number;
  overdueLoans: number;
  loading: boolean;
  error: string | null;
}

export function useStats() {
  const [stats, setStats] = useState<Stats>({
    totalItems: 0,
    availableItems: 0,
    activeLoans: 0,
    overdueLoans: 0,
    loading: true,
    error: null,
  });

  useEffect(() => {
    async function fetchStats() {
      try {
        const [itemsResponse, loansResponse] = await Promise.all([
          supabase.from('items').select('status'),
          supabase.from('loans').select('status, expected_return_date'),
        ]);

        if (itemsResponse.error) throw itemsResponse.error;
        if (loansResponse.error) throw loansResponse.error;

        const items = itemsResponse.data as Pick<Item, 'status'>[];
        const loans = loansResponse.data as Pick<Loan, 'status' | 'expected_return_date'>[];

        setStats({
          totalItems: items.length,
          availableItems: items.filter(item => item.status === 'available').length,
          activeLoans: loans.filter(loan => loan.status === 'active').length,
          overdueLoans: loans.filter(loan => 
            loan.status === 'active' && 
            new Date(loan.expected_return_date) < new Date()
          ).length,
          loading: false,
          error: null,
        });
      } catch (error) {
        setStats(prev => ({
          ...prev,
          loading: false,
          error: error instanceof Error ? error.message : 'An error occurred',
        }));
      }
    }

    fetchStats();
  }, []);

  return stats;
}