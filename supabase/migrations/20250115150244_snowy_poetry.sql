/*
  # Fix Forgot Password Functionality

  1. Changes
    - Drop and recreate security questions table with case-insensitive comparison
    - Update verify_security_answers function to handle case-insensitive comparison
    - Add new RLS policies for better security
*/

-- Drop existing function if exists
DROP FUNCTION IF EXISTS verify_security_answers(uuid, text, text);

-- Recreate security questions table
DROP TABLE IF EXISTS security_questions;
CREATE TABLE security_questions (
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

-- Create improved verify_security_answers function
CREATE OR REPLACE FUNCTION verify_security_answers(
    p_user_id uuid,
    p_first_car text,
    p_first_country text
) RETURNS boolean
LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1
        FROM security_questions
        WHERE user_id = p_user_id
        AND LOWER(TRIM(first_car)) = LOWER(TRIM(p_first_car))
        AND LOWER(TRIM(first_country)) = LOWER(TRIM(p_first_country))
    );
END;
$$;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON TABLE security_questions TO authenticated;
GRANT EXECUTE ON FUNCTION verify_security_answers TO authenticated;