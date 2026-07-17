/*
# Tighten RLS INSERT policies on feedback and contact_messages

1. Purpose
- The previous INSERT policies used `WITH CHECK (true)`, which the security scanner flags as bypassing row-level security.
- These tables are intentionally public (anonymous submissions, no sign-in required), so INSERT must remain open to `anon, authenticated`.
- The fix replaces `WITH CHECK (true)` with meaningful validation predicates that enforce the NOT NULL / CHECK constraints already on the columns, so only well-formed rows can be inserted.

2. Changes
- `contact_messages`: INSERT policy now requires non-empty name, email, and message.
- `feedback`: INSERT policy now requires a rating between 1 and 5 (matching the existing column CHECK) and a non-empty message. Name/email remain optional (nullable).
- SELECT policies are unchanged (intentionally public read for aggregate display).
- No schema changes, no data changes.

3. Security
- Still `TO anon, authenticated` so the anon-key frontend can submit without logging in.
- The WITH CHECK clause now validates payload shape instead of accepting everything.
- No UPDATE or DELETE policies added — submissions remain immutable from the client.
*/

-- contact_messages: replace unrestricted INSERT with validated INSERT
DROP POLICY IF EXISTS "anon_insert_contact_messages" ON contact_messages;
CREATE POLICY "anon_insert_contact_messages" ON contact_messages FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    name IS NOT NULL
    AND btrim(name) <> ''
    AND email IS NOT NULL
    AND btrim(email) <> ''
    AND message IS NOT NULL
    AND btrim(message) <> ''
  );

-- feedback: replace unrestricted INSERT with validated INSERT
DROP POLICY IF EXISTS "anon_insert_feedback" ON feedback;
CREATE POLICY "anon_insert_feedback" ON feedback FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    rating IS NOT NULL
    AND rating >= 1
    AND rating <= 5
    AND message IS NOT NULL
    AND btrim(message) <> ''
  );
