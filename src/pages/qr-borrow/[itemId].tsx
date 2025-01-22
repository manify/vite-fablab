import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

export default function QRBorrow() {
  const { itemId } = useParams();
  const { user } = useAuth();

  useEffect(() => {
    const autoBorrow = async () => {
      if (!user) {
        // Redirect to login with return URL
        window.location.href = `/login?redirect=/qr-borrow/${itemId}`;
        return;
      }

      try {
        const { data, error } = await supabase.rpc('borrow_item', {
          p_borrower_id: user.id,
          p_item_id: itemId,
          p_project_name: 'QR Borrow'
        });

        if (error) throw error;

        toast.success('Item borrowed successfully');
        window.location.href = '/dashboard';
      } catch (error) {
        console.error('Error:', error);
        toast.error('Failed to borrow item');
        window.location.href = '/dashboard';
      }
    };

    autoBorrow();
  }, [itemId, user]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-4">Processing borrow request...</h2>
        <p className="text-gray-600">Please wait while we process your request.</p>
      </div>
    </div>
  );
}