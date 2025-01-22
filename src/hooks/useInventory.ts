import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Item } from '../types/database';
import toast from 'react-hot-toast';

export function useInventory() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchItems() {
    try {
      const { data, error } = await supabase
        .from('items')
        .select(`
          *,
          categories (
            name
          )
        `)
        .order('name');

      if (error) throw error;
      setItems(data || []);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch items';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchItems();
  }, []);

  return { items, loading, error, refetch: fetchItems, setItems }; // Add setItems to the returned object
}