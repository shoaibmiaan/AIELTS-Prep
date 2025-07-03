// pages/api/evaluate-listening.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { listeningSets } from '@/lib/listeningSets';
import { supabase } from '@/lib/supabaseClient';

type ResponseData = {
  feedback: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ feedback: 'Method Not Allowed' });
  }

  const { userId, setId, answers } = req.body;

  // Get the correct set
  const selectedSet = listeningSets.find((s) => s.id === setId);
  if (!selectedSet) {
    return res.status(400).json({ feedback: 'Invalid listening set selected.' });
  }

  // Define correct answers for this set
  const answerKey: { [key: number]: string } = {
    0: 'He has no parking permit',
    1: 'Campus security office',
  };

  if (setId === 2) {
    Object.assign(answerKey, {
      0: 'Paris',
      1: 'Business',
    });
  }

  // Compare answers
  let score = 0;
  const total = selectedSet.questions.length;
  const details: string[] = [];

  for (let i = 0; i < total; i++) {
    const correct = answerKey[i];
    const userAnswer = answers[i];

    if (userAnswer?.trim().toLowerCase() === correct?.trim().toLowerCase()) {
      score += 1;
      details.push(`Q${i + 1}: ✅ Correct`);
    } else {
      details.push(`Q${i + 1}: ❌ Incorrect (Your answer: "${userAnswer || '-'}", Correct: "${correct}")`);
    }
  }

  const feedback = `Score: ${score}/${total}\n\n` + details.join('\n');

  // Store in Supabase (optional)
  try {
    const { error } = await supabase.from('listening_history').insert([
      {
        user_id: userId,
        set_id: setId,
        answers,
        feedback,
        score,
        created_at: new Date().toISOString(),
      },
    ]);
    if (error) console.error('Supabase insert error:', error);
  } catch (err) {
    console.error('Error saving to DB:', err);
  }

  return res.status(200).json({ feedback });
}
