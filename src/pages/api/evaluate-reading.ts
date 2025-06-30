// src/pages/api/evaluate-reading.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { generateAIReadingFeedback } from '@/lib/genai';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { answers, correctAnswers, raw_score, band_score } = req.body;

  // Optional: Add minimal validation for robustness
  if (
    !answers ||
    !correctAnswers ||
    typeof raw_score !== 'number' ||
    typeof band_score !== 'number'
  ) {
    return res.status(400).json({ error: 'Missing or invalid fields' });
  }

  try {
    const feedback = await generateAIReadingFeedback({
      answers,
      correctAnswers,
      raw_score,
      band_score,
    });
    return res.status(200).json({ feedback });
  } catch (error) {
    console.error('❌ AI evaluation failed:', error);
    return res.status(500).json({ error: 'AI evaluation failed' });
  }
}
