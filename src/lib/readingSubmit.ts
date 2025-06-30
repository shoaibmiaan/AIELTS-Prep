// src/lib/readingSubmit.ts
import { supabase } from './supabaseClient';

export async function submitReadingAttempt({
  userId,
  testId,
  answers,
  correctAnswers,
}: {
  userId: string;
  testId: string;
  answers: Record<number, string>;
  correctAnswers: Record<number, string>;
}) {
  let raw_score = 0;

  for (const [q, userAns] of Object.entries(answers)) {
    if (
      correctAnswers[q] &&
      userAns.trim().toLowerCase() === correctAnswers[q].trim().toLowerCase()
    ) {
      raw_score++;
    }
  }

  const band_score = mapRawScoreToBand(raw_score); // Define this next

  const { error } = await supabase.from('reading_attempts').insert([
    {
      user_id: userId,
      test_id: testId,
      raw_score,
      band_score,
      submitted_answers: answers,
    },
  ]);

  return { raw_score, band_score, error };
}
