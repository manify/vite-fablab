/*
  # Create test accounts

  1. Changes
    - Create admin and student test accounts
    - Set up their profile data
    
  2. Security
    - Passwords are hashed by Supabase Auth
    - Users have appropriate role assignments
*/

-- Create admin user
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
  'ad3e1700-0101-4b99-9a88-111111111111',
  '00000000-0000-0000-0000-000000000000',
  'admin@fablab.com',
  crypt('admin123', gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{"full_name":"Admin User"}',
  now(),
  now(),
  'authenticated'
);

-- Create student user
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
  'ad3e1700-0101-4b99-9a88-222222222222',
  '00000000-0000-0000-0000-000000000000',
  'student@fablab.com',
  crypt('student123', gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{"full_name":"Student User"}',
  now(),
  now(),
  'authenticated'
);

-- Update admin profile role
UPDATE profiles 
SET role = 'admin'
WHERE id = 'ad3e1700-0101-4b99-9a88-111111111111';

-- Update student profile
UPDATE profiles 
SET 
  student_id = 'STU123',
  department = 'Engineering'
WHERE id = 'ad3e1700-0101-4b99-9a88-222222222222';