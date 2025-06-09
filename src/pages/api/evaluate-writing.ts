// src/pages/api/evaluate-writing.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabaseClient';
import { generateFeedback } from '@/lib/genai';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { text, userId, promptId, durationSeconds, wordCount } = req.body;

  console.log('📥 Received payload:', { text, userId, promptId, durationSeconds, wordCount });

  if (!text || !userId) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    // Step 1: Insert the writing submission
    const { data: inserted, error: insertErr } = await supabase
      .from('writing_submissions')
      .insert([
        {
          user_id: userId,
          content: text,
          question: promptId || null,
          duration_seconds: durationSeconds || null,
          word_count: wordCount || null,
        },
      ])
      .select()
      .single();

    if (insertErr) {
      console.error('❌ Supabase insert error:', insertErr);
      return res.status(500).json({ message: 'Failed to save submission' });
    }

    console.log('✅ Inserted submission:', inserted);

    // Step 2: Generate AI feedback
    const feedback = await generateFeedback(text);
    console.log('🎯 AI Feedback:', feedback);

    // Step 3: Update the submission with feedback
    const { error: updateErr } = await supabase
      .from('writing_submissions')
      .update({ feedback })
      .eq('id', inserted.id);

    if (updateErr) {
      console.error('⚠️ Feedback update error:', updateErr);
    }

    return res.status(200).json({ feedback });
  } catch (error) {
    console.error('💥 Unexpected server error:', error);
    return res.status(500).json({ message: 'Unexpected server error', error: String(error) });
  }
}
