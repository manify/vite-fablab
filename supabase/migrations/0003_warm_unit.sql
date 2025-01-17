/*
  # Create super admin account

  1. Changes
    - Creates a super admin user account
    - Updates the profile role to super_admin
*/

-- Create super admin user
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  role
) VALUES (
  'ad3e1700-0101-4b99-9a88-333333333333',
  '00000000-0000-0000-0000-000000000000',
  'superadmin@fablab.com',
  crypt('superadmin123', gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{"full_name":"Super Admin User"}',
  now(),
  now(),
  'authenticated'
);

-- Update super admin profile role
UPDATE profiles 
SET role = 'super_admin'
WHERE id = 'ad3e1700-0101-4b99-9a88-333333333333';