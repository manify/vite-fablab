/*
  # Add security questions functionality
  
  1. New Table
    - security_questions: Stores user security questions and answers
  
  2. New Functions
    - verify_security_answers: Function to verify security question answers
    - reset_password_with_security: Function to reset password using security questions
  
  3. Security
    - RLS policies to protect security questions data
    - Functions are security definer to ensure proper access control
*/

-- Create security questions table
CREATE TABLE IF NOT EXISTS security_questions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users NOT NULL,
    first_car text NOT NULL,
    first_country text NOT NULL,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE security_questions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own security questions"
    ON security_questions FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own security questions"
    ON security_questions FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

-- Functions
CREATE OR REPLACE FUNCTION verify_security_answers(
    p_student_id text,
    p_first_car text,
    p_first_country text
) RETURNS boolean
LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
    v_user_id uuid;
BEGIN
    -- Get user_id from student_id
    SELECT id INTO v_user_id
    FROM profiles
    WHERE student_id = p_student_id;

    RETURN EXISTS (
        SELECT 1
        FROM security_questions
        WHERE user_id = v_user_id
        AND first_car = p_first_car
        AND first_country = p_first_country
    );
END;
$$;

CREATE OR REPLACE FUNCTION reset_password_with_security(
    p_student_id text,
    p_first_car text,
    p_first_country text,
    p_new_password text
) RETURNS boolean
LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
    v_user_id uuid;
    v_verified boolean;
BEGIN
    -- Get user_id from student_id
    SELECT id INTO v_user_id
    FROM profiles
    WHERE student_id = p_student_id;

    IF v_user_id IS NULL THEN
        RETURN false;
    END IF;

    -- Verify security questions
    SELECT EXISTS (
        SELECT 1
        FROM security_questions
        WHERE user_id = v_user_id
        AND first_car = p_first_car
        AND first_country = p_first_country
    ) INTO v_verified;

    IF v_verified THEN
        -- Update password
        UPDATE auth.users
        SET encrypted_password = crypt(p_new_password, gen_salt('bf'))
        WHERE id = v_user_id;
        
        RETURN true;
    END IF;

    RETURN false;
END;
$$;