// src/pages/api/feedback.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import { generateFeedback } from '@/lib/genai'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' })
  const { text } = req.body
  if (typeof text !== 'string') return res.status(400).json({ error: 'Missing text' })

  try {
    const output = await generateFeedback(text)
    return res.status(200).json({ output })
  } catch (err: any) {
    console.error('Feedback error', err)
    return res.status(500).json({ error: err.message })
  }
}
