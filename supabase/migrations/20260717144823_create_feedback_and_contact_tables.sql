/*
# Create feedback and contact_messages tables

1. Purpose
- Adds two new tables to support the new site features: an interactive feedback/rating system and a contact form.
- `feedback` stores star ratings and optional suggestions submitted by visitors about the site's tools.
- `contact_messages` stores messages submitted through the Contact Us form (name, email, message).

2. New Tables
- `feedback`
  - `id` (uuid, primary key, default gen_random_uuid())
  - `name` (text, nullable — optional display name of the person giving feedback)
  - `email` (text, nullable — optional email for follow-up)
  - `rating` (integer, 1–5, NOT NULL — the star rating)
  - `tool` (text, nullable — optional name of the tool the feedback is about)
  - `message` (text, nullable — the written suggestion/comment)
  - `created_at` (timestamptz, default now())
- `contact_messages`
  - `id` (uuid, primary key, default gen_random_uuid())
  - `name` (text, NOT NULL — submitter's name)
  - `email` (text, NOT NULL — submitter's email)
  - `message` (text, NOT NULL — the message body)
  - `created_at` (timestamptz, default now())

3. Security
- Enable RLS on both tables.
- Both tables are intentionally public/shared (no sign-in required to submit feedback or contact messages), so policies use `TO anon, authenticated` with `USING (true)` / `WITH CHECK (true)`.
- This allows the anon-key frontend client to INSERT new rows. SELECT is also public so the site could display aggregate ratings if desired.
- No UPDATE or DELETE policies are provided — submissions are immutable from the client.

4. Important Notes
- This is a single-tenant / no-auth-required data model for public submissions.
- The user authentication system (login/signup) is handled by Supabase Auth and does not require a custom users table.
- No foreign keys to auth.users because feedback and contact submissions are anonymous by design.
*/

CREATE TABLE IF NOT EXISTS feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text,
  email text,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  tool text,
  message text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_feedback" ON feedback;
CREATE POLICY "anon_select_feedback" ON feedback FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_feedback" ON feedback;
CREATE POLICY "anon_insert_feedback" ON feedback FOR INSERT
  TO anon, authenticated WITH CHECK (true);

CREATE TABLE IF NOT EXISTS contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  message text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_contact_messages" ON contact_messages;
CREATE POLICY "anon_select_contact_messages" ON contact_messages FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_contact_messages" ON contact_messages;
CREATE POLICY "anon_insert_contact_messages" ON contact_messages FOR INSERT
  TO anon, authenticated WITH CHECK (true);
