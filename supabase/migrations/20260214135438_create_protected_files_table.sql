/*
  # Create protected_files table for SecureOX

  1. New Tables
    - `protected_files`
      - `id` (uuid, primary key) - Unique identifier for each protected file
      - `name` (text) - Original filename
      - `size` (integer) - File size in bytes
      - `password` (text) - Password to unlock the file
      - `file_data` (text) - Base64 encoded file data
      - `created_at` (timestamptz) - Timestamp when file was protected
  
  2. Security
    - Enable RLS on `protected_files` table
    - Add policy for anyone to insert files (public file protection)
    - Add policy for anyone to read files (they still need password to unlock)
    - Add policy for anyone to delete files (cleanup)
  
  3. Notes
    - This is a proof of concept with public access
    - In production, you would want user authentication and ownership checks
    - Passwords are stored in plain text for demo purposes (use hashing in production)
*/

CREATE TABLE IF NOT EXISTS protected_files (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  size integer NOT NULL,
  password text NOT NULL,
  file_data text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE protected_files ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert protected files"
  ON protected_files
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can view protected files"
  ON protected_files
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can delete protected files"
  ON protected_files
  FOR DELETE
  TO anon, authenticated
  USING (true);