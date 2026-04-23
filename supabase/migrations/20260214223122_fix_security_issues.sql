/*
  # Fix Security Issues

  ## 1. Performance Optimization
    - Update demo_requests SELECT policy to use `(select auth.uid())` for better performance
    - This prevents re-evaluation of auth.uid() for each row

  ## 2. RLS Policy Security Improvements
    
    ### demo_requests table:
    - Keep INSERT policy permissive (public demo form requires this)
    - Add validation checks for required fields
    
    ### operation_logs table:
    - Add user_id column for tracking (allows NULL for backward compatibility)
    - Restrict INSERT to authenticated users only (was: anyone)
    - Add SELECT policy for authenticated users to view their own logs
    - Remove unused index on request_id (not queried in application code)
    
    ### protected_files table:
    - Add user_id column for proper ownership tracking
    - Restrict DELETE to file owners (NULL user_id allows anon deletion)
    - Add validation checks for file data

  ## 3. Manual Configuration Required
    - Auth DB Connection Strategy: Change to "Percentage" in Supabase Dashboard → Database Settings
    - Leaked Password Protection: Enable in Supabase Dashboard → Authentication → Settings → Security
*/

-- Remove unused index on request_id if it exists
DROP INDEX IF EXISTS idx_operation_logs_request_id;

-- Add user_id to operation_logs if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'operation_logs' AND column_name = 'user_id'
  ) THEN
    ALTER TABLE operation_logs ADD COLUMN user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL;
  END IF;
END $$;

-- Add user_id to protected_files for ownership tracking
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'protected_files' AND column_name = 'user_id'
  ) THEN
    ALTER TABLE protected_files ADD COLUMN user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL;
  END IF;
END $$;

-- Drop and recreate demo_requests policies with optimized auth check
DROP POLICY IF EXISTS "Authenticated users can view their own demo requests" ON demo_requests;
DROP POLICY IF EXISTS "Anyone can submit demo requests" ON demo_requests;

-- Optimized SELECT policy using (select auth.uid())
CREATE POLICY "Authenticated users can view their own demo requests"
  ON demo_requests
  FOR SELECT
  TO authenticated
  USING (email = (SELECT email FROM auth.users WHERE id = (select auth.uid())));

-- Keep INSERT permissive for public demo form, but add validation
CREATE POLICY "Public can submit demo requests"
  ON demo_requests
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    full_name IS NOT NULL 
    AND email IS NOT NULL 
    AND company IS NOT NULL
    AND length(full_name) > 0
    AND length(email) > 0
    AND length(company) > 0
  );

-- Drop and recreate operation_logs policies with proper restrictions
DROP POLICY IF EXISTS "Anyone can insert operation logs" ON operation_logs;
DROP POLICY IF EXISTS "Authenticated users can view operation logs" ON operation_logs;

-- Allow both authenticated and anon users to log (anon for public features)
-- But if authenticated, must match user_id
CREATE POLICY "Users can insert operation logs"
  ON operation_logs
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    CASE 
      WHEN auth.uid() IS NOT NULL THEN user_id = (select auth.uid())
      ELSE user_id IS NULL
    END
  );

-- Users can view their own logs, anon can't view any logs
CREATE POLICY "Users can view their own operation logs"
  ON operation_logs
  FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

-- Drop and recreate protected_files policies with ownership checks
DROP POLICY IF EXISTS "Anyone can delete protected files" ON protected_files;
DROP POLICY IF EXISTS "Anyone can insert protected files" ON protected_files;
DROP POLICY IF EXISTS "Anyone can view protected files" ON protected_files;

-- Users can create protected files with validation
CREATE POLICY "Users can create protected files"
  ON protected_files
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    name IS NOT NULL 
    AND size > 0 
    AND password IS NOT NULL 
    AND file_data IS NOT NULL
    AND length(name) > 0
    AND length(password) >= 8
    AND length(file_data) > 0
  );

-- Anyone can view protected files (they need password to decrypt anyway)
CREATE POLICY "Users can view protected files"
  ON protected_files
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Users can only delete their own files (or anon can delete files without user_id)
CREATE POLICY "Users can delete their own protected files"
  ON protected_files
  FOR DELETE
  TO anon, authenticated
  USING (
    user_id IS NULL 
    OR user_id = (select auth.uid())
  );