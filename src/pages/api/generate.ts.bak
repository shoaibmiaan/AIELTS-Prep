// src/pages/api/generate.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import { generateModule } from '@/lib/genai'

type Data = { output?: string; error?: string }

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  const { prompt, text } = req.body
  if (typeof prompt !== 'string' || typeof text !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid prompt/text' })
  }

  try {
    const output = await generateModule(text, prompt)
    return res.status(200).json({ output })
  } catch (err: any) {
    console.error('🛑 /api/generate error:', err)
    return res
      .status(500)
      .json({ error: err.message || 'Internal server error' })
  }
}
