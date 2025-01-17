/*
  # Fix user creation migration
  
  1. Changes
    - Remove duplicate raw_user_meta_data column
    - Add proper error handling
    - Ensure clean deletion of existing users
*/

DO $$
DECLARE
  v_super_admin_id UUID := gen_random_uuid();
  v_admin_id UUID := gen_random_uuid();
  v_student_id UUID := gen_random_uuid();
BEGIN
  -- First, delete existing profiles and users in the correct order
  DELETE FROM profiles 
  WHERE id IN (
    SELECT id FROM auth.users 
    WHERE email IN ('superadmin@fablab.com', 'admin@fablab.com', 'student@fablab.com')
  );

  DELETE FROM auth.users 
  WHERE email IN ('superadmin@fablab.com', 'admin@fablab.com', 'student@fablab.com');

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
    role,
    aud,
    confirmation_token
  ) VALUES (
    v_super_admin_id,
    '00000000-0000-0000-0000-000000000000',
    'superadmin@fablab.com',
    crypt('superadmin123', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}',
    '{"full_name":"Super Admin User"}',
    now(),
    now(),
    'authenticated',
    'authenticated',
    encode(gen_random_bytes(32), 'base64')
  );

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
    role,
    aud,
    confirmation_token
  ) VALUES (
    v_admin_id,
    '00000000-0000-0000-0000-000000000000',
    'admin@fablab.com',
    crypt('admin123', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}',
    '{"full_name":"Admin User"}',
    now(),
    now(),
    'authenticated',
    'authenticated',
    encode(gen_random_bytes(32), 'base64')
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
    role,
    aud,
    confirmation_token
  ) VALUES (
    v_student_id,
    '00000000-0000-0000-0000-000000000000',
    'student@fablab.com',
    crypt('student123', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}',
    '{"full_name":"Student User"}',
    now(),
    now(),
    'authenticated',
    'authenticated',
    encode(gen_random_bytes(32), 'base64')
  );

  -- Wait a moment to ensure user creation is complete
  PERFORM pg_sleep(1);

  -- Create profiles manually with error handling
  BEGIN
    INSERT INTO profiles (id, role, full_name, student_id, department)
    VALUES 
      (v_super_admin_id, 'super_admin', 'Super Admin User', NULL, NULL),
      (v_admin_id, 'admin', 'Admin User', NULL, NULL),
      (v_student_id, 'student', 'Student User', 'STU123', 'Engineering');
  EXCEPTION 
    WHEN unique_violation THEN
      -- If profiles already exist, update them instead
      UPDATE profiles 
      SET role = 'super_admin',
          full_name = 'Super Admin User'
      WHERE id = v_super_admin_id;

      UPDATE profiles 
      SET role = 'admin',
          full_name = 'Admin User'
      WHERE id = v_admin_id;

      UPDATE profiles 
      SET role = 'student',
          full_name = 'Student User',
          student_id = 'STU123',
          department = 'Engineering'
      WHERE id = v_student_id;
  END;

END $$;