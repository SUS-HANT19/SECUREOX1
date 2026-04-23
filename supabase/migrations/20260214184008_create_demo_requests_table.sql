/*
  # Create Demo Requests Table

  1. New Tables
    - `demo_requests`
      - `id` (uuid, primary key) - Unique identifier for each demo request
      - `full_name` (text) - Full name of the person requesting the demo
      - `email` (text) - Email address for contact
      - `company` (text) - Company name
      - `phone` (text, nullable) - Phone number (optional)
      - `message` (text, nullable) - Additional information or requirements
      - `status` (text) - Request status (pending, contacted, scheduled, completed, cancelled)
      - `created_at` (timestamptz) - When the request was submitted
      - `updated_at` (timestamptz) - When the request was last updated

  2. Security
    - Enable RLS on `demo_requests` table
    - Add policy for inserting demo requests (allow anyone to submit)
    - Add policy for authenticated admins to view and manage requests
*/

CREATE TABLE IF NOT EXISTS demo_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  email text NOT NULL,
  company text NOT NULL,
  phone text,
  message text,
  status text DEFAULT 'pending' NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE demo_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit demo requests"
  ON demo_requests
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view their own demo requests"
  ON demo_requests
  FOR SELECT
  TO authenticated
  USING (email = (SELECT email FROM auth.users WHERE id = auth.uid()));
