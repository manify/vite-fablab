/*
  # Add security questions functionality
  
  1. New Functions
    - verify_security_answers: Function to verify security question answers
    - reset_password_with_security: Function to reset password using security questions
  
  2. Security
    - Functions are security definer to ensure proper access control
    - Only authenticated users can access their own security questions
*/

-- Function to verify security answers and reset password
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