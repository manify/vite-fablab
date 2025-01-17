-- Create a function to handle returning items
CREATE OR REPLACE FUNCTION return_item(loan_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_item_id uuid;
BEGIN
    -- Get the item_id from the loan
    SELECT item_id INTO v_item_id
    FROM loans
    WHERE id = loan_id;

    -- Update the loan status
    UPDATE loans
    SET 
        status = 'returned',
        actual_return_date = CURRENT_TIMESTAMP
    WHERE id = loan_id;

    -- Update the item status
    UPDATE items
    SET status = 'available'
    WHERE id = v_item_id;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION return_item TO authenticated;

-- Add policies for loan management
DROP POLICY IF EXISTS "Users can view their own loans" ON loans;
CREATE POLICY "Users can view their own loans"
ON loans FOR SELECT
TO authenticated
USING (
    borrower_id = auth.uid() OR
    EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role IN ('admin', 'super_admin')
    )
);

DROP POLICY IF EXISTS "Students can create loans" ON loans;
CREATE POLICY "Students can create loans"
ON loans FOR INSERT
TO authenticated
WITH CHECK (
    auth.uid() = borrower_id AND
    EXISTS (
        SELECT 1 FROM items
        WHERE items.id = item_id
        AND items.status = 'available'
    )
);

DROP POLICY IF EXISTS "Users can update their own active loans" ON loans;
CREATE POLICY "Users can update their own active loans"
ON loans FOR UPDATE
TO authenticated
USING (
    borrower_id = auth.uid() AND
    status = 'active'
)
WITH CHECK (
    status = 'returned' AND
    actual_return_date IS NOT NULL
);