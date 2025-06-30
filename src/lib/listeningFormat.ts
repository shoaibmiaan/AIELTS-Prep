/**
 * This file defines all the core pieces for the IELTS Listening module:
 *
 * 1) AI conversion instructions (`listeningFormatInstructions`) for raw text → JSON/CSV.
 * 2) Supabase table DDL (`listeningSchemaSQL`) for storing tests, sections, questions,
 *    attempts, and user responses.
 * 3) Example client‐side auto‐check logic (`listeningAutoCheckInstructions`) to compare
 *    user answers against `correctAnswer`.
 */

// ────────────────────────────────────────────────────────────────────────────────
// 1) AI FORMAT INSTRUCTIONS
// ────────────────────────────────────────────────────────────────────────────────
export const listeningFormatInstructions = `
You are an IELTS Listening test converter. Given raw text extracted from a Listening PDF,
output valid **JSON** according to this schema:

{
  "title": string,              // e.g. "Listening Practice Test 1"
  "audioSrc": string,           // URL or identifier for the audio file
  "sections": [
    {
      "section": number,        // 1 through 4
      "instructions": string,   // e.g. "Write ONE WORD AND/OR A NUMBER for each answer."
      "questions": [
        {
          "questionNumber": number,
          "type": "fill-blank" | "mcq" | "matching" | "map-diagram" | "sentence-completion" | "short-answer",
          "questionText": string,
          "options"?: string[],            // for mcq or matching
          "correctAnswer"?: string|string[] // single string for fill-blank/mcq, array for matching
        }
      ]
    }
  ]
}

To output **CSV**, use columns exactly in this order:
Section,Question Number,Type,Question Text,Option A,Option B,Option C,Option D,Correct Answer

Use ONLY this schema. Do NOT include any extra fields or comments. Output **JSON** or **CSV** only.`


// ────────────────────────────────────────────────────────────────────────────────
// 2) SUPABASE TABLE SCHEMA (SQL DDL)
// ────────────────────────────────────────────────────────────────────────────────
export const listeningSchemaSQL = `
-- Enable UUIDs
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Top-level test record
CREATE TABLE IF NOT EXISTS listening_tests (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title       TEXT NOT NULL,
  audio_src   TEXT NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Sections 1–4
CREATE TABLE IF NOT EXISTS listening_sections (
  id              SERIAL PRIMARY KEY,
  test_id         UUID NOT NULL REFERENCES listening_tests(id) ON DELETE CASCADE,
  section_number  INT NOT NULL CHECK (section_number BETWEEN 1 AND 4),
  instructions    TEXT NOT NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(test_id, section_number)
);

-- Questions within each section
CREATE TABLE IF NOT EXISTS listening_questions (
  id               SERIAL PRIMARY KEY,
  section_id       INT NOT NULL REFERENCES listening_sections(id) ON DELETE CASCADE,
  question_number  INT NOT NULL,
  type             TEXT NOT NULL CHECK (type IN (
                     'fill-blank','mcq','matching','map-diagram',
                     'sentence-completion','short-answer')),
  question_text    TEXT NOT NULL,
  options          TEXT[] NULL,
  correct_answer   TEXT[] NULL,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(section_id, question_number)
);

-- Attempts metadata
CREATE TABLE IF NOT EXISTS listening_attempts (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID NOT NULL,
  test_id      UUID NOT NULL REFERENCES listening_tests(id),
  started_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ,
  total_score  INT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Individual question responses
CREATE TABLE IF NOT EXISTS listening_responses (
  id               SERIAL PRIMARY KEY,
  attempt_id       UUID NOT NULL REFERENCES listening_attempts(id) ON DELETE CASCADE,
  section_number   INT NOT NULL,
  question_number  INT NOT NULL,
  user_answer      TEXT NOT NULL,
  is_correct       BOOLEAN NOT NULL,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);
`;


// ────────────────────────────────────────────────────────────────────────────────
// 3) CLIENT-SIDE AUTO-CHECK INSTRUCTIONS
// ────────────────────────────────────────────────────────────────────────────────
export const listeningAutoCheckInstructions = `
To auto-check user answers:

1. Fetch the test JSON with sections and questions (each q.correctAnswer is string[]).
2. Maintain a map of user answers: Record<number, string> where key is questionNumber.
3. Iterate through questions:
     const userAns = (answers[q.questionNumber] || '').trim().toLowerCase();
     const correctList = q.correctAnswer.map(a => a.toLowerCase());
     const isCorrect = correctList.includes(userAns);
     if (isCorrect) score++;
4. After all, score is the total correct, max is sum of questions count.
5. To persist:
   a) Insert into listening_attempts { user_id, test_id } → get attempt_id.
   b) batch-insert listening_responses rows with attempt_id, section_number,
      question_number, user_answer, is_correct.
   c) Update listening_attempts.completed_at and total_score.
`;
