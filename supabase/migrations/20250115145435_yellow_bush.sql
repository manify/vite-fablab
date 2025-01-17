/*
  # Add email field to profiles table

  1. Changes
    - Add email field to profiles table
    - Add unique constraint on email
    - Update trigger to populate email field
    - Add RLS policies for email field

  2. Security
    - Enable RLS for email field access
    - Only allow users to view their own email
*/

-- Add email field to profiles table
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS email text;

-- Add unique constraint
ALTER TABLE profiles
ADD CONSTRAINT profiles_email_key UNIQUE (email);

-- Update the handle_auth_user_created function to include email
CREATE OR REPLACE FUNCTION handle_auth_user_created()
RETURNS trigger
SECURITY DEFINER SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, role)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', ''),
    new.email,
    'student'
  );
  RETURN new;
END;
$$;

-- Update existing profiles with email from auth.users
DO $$
BEGIN
  UPDATE profiles p
  SET email = u.email
  FROM auth.users u
  WHERE p.id = u.id
  AND p.email IS NULL;
END $$;

-- Add RLS policies for email field
CREATE POLICY "Users can view their own email"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (
    id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'super_admin')
    )
  );