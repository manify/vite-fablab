import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';

export default function BorrowPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const itemId = searchParams.get('id');
  const token = searchParams.get('token');

  useEffect(() => {
    const borrowItem = async () => {
      if (!itemId || !token) {
        toast.error('Invalid QR code');
        navigate('/');
        return;
      }

      try {
        const { error } = await supabase.rpc('borrow_item', {
          p_item_id: itemId,
          token: token
        });

        if (error) throw error;
        toast.success('Item borrowed successfully');
        navigate('/dashboard');
      } catch (error) {
        console.error('Error borrowing item:', error);
        toast.error('Failed to borrow item');
        navigate('/');
      }
    };

    borrowItem();
  }, [itemId, token, navigate]);

  return <div>Processing borrow request...</div>;
}