/*
  # Fablab Inventory Management System Schema

  1. New Tables
    - `profiles`: Extended user profile data
    - `items`: Main inventory items table
    - `categories`: Item categories
    - `loans`: Lending transactions
    - `notifications`: System notifications
    
  2. Security
    - Enable RLS on all tables
    - Policies for different user roles
*/

-- Create enum types
CREATE TYPE user_role AS ENUM ('student', 'admin', 'super_admin');
CREATE TYPE item_status AS ENUM ('available', 'borrowed', 'maintenance', 'lost');
CREATE TYPE notification_type AS ENUM ('due_date', 'overdue', 'return_reminder', 'system');

-- Create tables
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  category_id uuid REFERENCES categories(id),
  qr_code text UNIQUE NOT NULL,
  status item_status DEFAULT 'available',
  condition text,
  location text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  role user_role DEFAULT 'student',
  full_name text,
  student_id text UNIQUE,
  department text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS loans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id uuid REFERENCES items(id),
  borrower_id uuid REFERENCES profiles(id),
  approved_by uuid REFERENCES profiles(id),
  borrow_date timestamptz DEFAULT now(),
  expected_return_date timestamptz NOT NULL,
  actual_return_date timestamptz,
  project_name text,
  course_details text,
  status text DEFAULT 'active',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id),
  type notification_type NOT NULL,
  message text NOT NULL,
  read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE items ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE loans ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Categories are viewable by all authenticated users"
  ON categories FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Categories are manageable by admins"
  ON categories
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'super_admin')
    )
  );

CREATE POLICY "Items are viewable by all authenticated users"
  ON items FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Items are manageable by admins"
  ON items
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'super_admin')
    )
  );

CREATE POLICY "Users can view all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update their own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Loans are viewable by all authenticated users"
  ON loans FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Students can create loan requests"
  ON loans
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'student'
    )
  );

CREATE POLICY "Users can view their own notifications"
  ON notifications
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Functions and Triggers
CREATE OR REPLACE FUNCTION handle_auth_user_created()
RETURNS trigger
SECURITY DEFINER SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', ''),
    'student'
  );
  RETURN new;
END;
$$;

CREATE OR REPLACE FUNCTION handle_loan_status_change()
RETURNS trigger
SECURITY DEFINER SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  IF new.status = 'active' THEN
    UPDATE public.items SET status = 'borrowed' WHERE id = new.item_id;
  ELSIF new.status = 'returned' THEN
    UPDATE public.items SET status = 'available' WHERE id = new.item_id;
  END IF;
  RETURN new;
END;
$$;

-- Create Triggers
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_auth_user_created();

CREATE TRIGGER on_loan_status_change
  AFTER INSERT OR UPDATE OF status ON loans
  FOR EACH ROW EXECUTE FUNCTION handle_loan_status_change();