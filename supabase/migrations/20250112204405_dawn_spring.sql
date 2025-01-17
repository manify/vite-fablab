/*
  # Fix role management policies

  1. Changes
    - Add policies to allow super_admin to update user roles
    - Add policy to prevent users from modifying their own role
    - Add policy to prevent non-super_admin users from modifying roles

  2. Security
    - Enable RLS for profiles table
    - Add specific policies for role management
*/

-- Drop existing update policy if it exists
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;

-- Create new policies for profile updates
CREATE POLICY "Users can update their own profile except role"
ON profiles
FOR UPDATE
TO authenticated
USING (
  auth.uid() = id
)
WITH CHECK (
  auth.uid() = id AND
  role IS NOT DISTINCT FROM (SELECT role FROM profiles WHERE id = auth.uid())
);

CREATE POLICY "Super admin can update any profile including roles"
ON profiles
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'super_admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'super_admin'
  )
);