import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabaseClient';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });

  const { title, type, instructions, passages } = req.body;

  if (!title || !type || !Array.isArray(passages)) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const client = supabase;

  try {
    // 1. Insert paper
    const { data: paper, error: paperError } = await client
      .from('reading_papers')
      .insert([{ title, type, instructions }])
      .select()
      .single();

    if (paperError || !paper) throw paperError || new Error('Paper insert failed');

    for (const passage of passages) {
      const { passage_number, passage_title, passage_text, questions } = passage;
      // 2. Insert passage
      const { data: passageRow, error: passageError } = await client
        .from('reading_passages')
        .insert([{
          paper_id: paper.id,
          passage_number,
          passage_title,
          passage_text
        }])
        .select()
        .single();

      if (passageError || !passageRow) throw passageError || new Error('Passage insert failed');

      // 3. Insert questions
      if (Array.isArray(questions)) {
        for (const q of questions) {
          const { question_number, question_text, question_type, options, correct_answer, explanation } = q;
          const { error: questionError } = await client
            .from('reading_questions')
            .insert([{
              passage_id: passageRow.id,
              question_number,
              question_text,
              question_type,
              options: options ? JSON.stringify(options) : null,
              correct_answer,
              explanation,
            }]);
          if (questionError) throw questionError;
        }
      }
    }
    return res.status(200).json({ success: true, paper_id: paper.id });
  } catch (err) {
    console.error('Upload failed:', err);
    return res.status(500).json({ message: 'Upload failed', error: err?.message });
  }
}
