import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { itemId, token } = req.query;

  if (!itemId || !token) {
    return res.status(400).json({ error: 'Missing required parameters' });
  }

  try {
    // Verify token
    const { data: user, error: authError } = await supabase.auth.getUser(token as string);
    if (authError) throw authError;

    // Borrow item
    const { data, error } = await supabase.rpc('qr_borrow_item', {
      p_item_id: itemId,
      p_borrower_id: user.user.id
    });

    if (error) throw error;

    return res.status(200).json(data);
  } catch (error) {
    console.error('QR borrow error:', error);
    return res.status(500).json({ error: 'Failed to process QR borrow request' });
  }
}