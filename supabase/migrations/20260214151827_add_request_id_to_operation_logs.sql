/*
  # Add request_id to operation_logs table

  1. Changes
    - Add `request_id` (uuid) column to operation_logs table
    - This allows tracking related operations across the request lifecycle
    - Add index for efficient request_id queries
  
  2. Notes
    - request_id enables correlating multiple operations from the same user session
    - Example: OCR extraction followed by encryption would share the same request_id
    - This is metadata only - NEVER log sensitive data
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'operation_logs' AND column_name = 'request_id'
  ) THEN
    ALTER TABLE operation_logs ADD COLUMN request_id uuid NOT NULL DEFAULT gen_random_uuid();
    CREATE INDEX IF NOT EXISTS idx_operation_logs_request_id ON operation_logs(request_id);
  END IF;
END $$;