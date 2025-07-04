import fs from 'fs';
import path from 'path';
import { NextApiRequest, NextApiResponse } from 'next';

const FILE_PATH = path.join(process.cwd(), 'public', 'FeatureTracker.json');

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST allowed' });
  }

  try {
    const features = req.body;

    fs.writeFileSync(FILE_PATH, JSON.stringify(features, null, 2));
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Save error:', err);
    return res.status(500).json({ error: 'Failed to save features' });
  }
}
