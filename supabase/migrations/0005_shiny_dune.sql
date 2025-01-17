/*
  # Create default users with proper variable naming
  
  1. Changes
    - Rename PL/pgSQL variables to avoid ambiguity with column names
    - Add existence checks before creating users
    - Update profile roles for new users
*/

DO $$
DECLARE
  v_super_admin_id UUID;
  v_admin_id UUID;
  v_student_id UUID;
BEGIN
  -- Check if superadmin exists
  SELECT id INTO v_super_admin_id FROM auth.users WHERE email = 'superadmin@fablab.com';
  IF v_super_admin_id IS NULL THEN
    v_super_admin_id := gen_random_uuid();
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
  END IF;

  -- Check if admin exists
  SELECT id INTO v_admin_id FROM auth.users WHERE email = 'admin@fablab.com';
  IF v_admin_id IS NULL THEN
    v_admin_id := gen_random_uuid();
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
  END IF;

  -- Check if student exists
  SELECT id INTO v_student_id FROM auth.users WHERE email = 'student@fablab.com';
  IF v_student_id IS NULL THEN
    v_student_id := gen_random_uuid();
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
  END IF;

  -- Update profile roles if users exist
  IF v_super_admin_id IS NOT NULL THEN
    UPDATE profiles 
    SET role = 'super_admin'
    WHERE id = v_super_admin_id;
  END IF;

  IF v_admin_id IS NOT NULL THEN
    UPDATE profiles 
    SET role = 'admin'
    WHERE id = v_admin_id;
  END IF;

  IF v_student_id IS NOT NULL THEN
    UPDATE profiles 
    SET 
      role = 'student',
      student_id = 'STU123',
      department = 'Engineering'
    WHERE id = v_student_id;
  END IF;
END $$;