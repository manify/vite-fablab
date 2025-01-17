/*
  # Update user role to admin
  
  1. Changes
    - Updates a student's role to admin in the profiles table
*/

-- Function to update user role
CREATE OR REPLACE FUNCTION update_user_role(user_email TEXT, new_role user_role)
RETURNS void AS $$
BEGIN
  UPDATE profiles
  SET role = new_role
  WHERE id = (
    SELECT id 
    FROM auth.users 
    WHERE email = user_email
  );
END;
$$ LANGUAGE plpgsql;

-- Example usage: Make a student an admin
SELECT update_user_role('student@fablab.com', 'admin');