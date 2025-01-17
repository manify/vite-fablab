/*
  # Add Security Questions Table and Functions

  1. New Tables
    - `security_questions`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `first_car` (text)
      - `first_country` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on security_questions table
    - Add policies for user access
    - Add functions for verification and password reset
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
        AND lower(first_car) = lower(p_first_car)
        AND lower(first_country) = lower(p_first_country)
    );
END;
$$;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON TABLE security_questions TO authenticated;
GRANT EXECUTE ON FUNCTION verify_security_answers TO authenticated;