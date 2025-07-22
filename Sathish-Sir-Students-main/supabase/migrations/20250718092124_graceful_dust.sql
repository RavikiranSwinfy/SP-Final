/*
  # Create HR Management Tables

  1. New Tables
    - `hr_entries`
      - `id` (uuid, primary key)
      - `da_name` (text)
      - `company_name` (text)
      - `hr_name` (text)
      - `hr_contact` (text)
      - `created_at` (timestamp)
    - `questions`
      - `id` (uuid, primary key)
      - `text` (text)
      - `topic` (text)
      - `asked_by` (text)
      - `created_at` (timestamp)
    - `answers`
      - `id` (uuid, primary key)
      - `question_id` (uuid, foreign key)
      - `answer_text` (text)
      - `answered_by` (text)
      - `created_at` (timestamp)
    - `jobs`
      - `id` (uuid, primary key)
      - `da_name` (text)
      - `phone_number` (text, optional)
      - `job_link` (text)
      - `file_name` (text, optional)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to perform CRUD operations
*/

-- HR Entries Table
CREATE TABLE IF NOT EXISTS hr_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  da_name text NOT NULL,
  company_name text NOT NULL,
  hr_name text NOT NULL,
  hr_contact text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE hr_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read hr_entries"
  ON hr_entries
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can insert hr_entries"
  ON hr_entries
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Questions Table
CREATE TABLE IF NOT EXISTS questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  text text NOT NULL,
  topic text NOT NULL,
  asked_by text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read questions"
  ON questions
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can insert questions"
  ON questions
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Answers Table
CREATE TABLE IF NOT EXISTS answers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id uuid REFERENCES questions(id) ON DELETE CASCADE,
  answer_text text NOT NULL,
  answered_by text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE answers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read answers"
  ON answers
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can insert answers"
  ON answers
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Jobs Table
CREATE TABLE IF NOT EXISTS jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  da_name text NOT NULL,
  phone_number text,
  job_link text NOT NULL,
  file_name text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read jobs"
  ON jobs
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can insert jobs"
  ON jobs
  FOR INSERT
  TO public
  WITH CHECK (true);