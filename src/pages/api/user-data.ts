import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json({
    bandScores: { Reading: 6.5, Listening: 7.0, Speaking: 6.0, Writing: 6.5 },
    skillData: [
      { skill: 'Vocabulary', level: 75, color: '#6366f1' },
      { skill: 'Grammar', level: 65, color: '#10b981' },
      { skill: 'Fluency', level: 70, color: '#f59e0b' },
      { skill: 'Pronunciation', level: 60, color: '#8b5cf6' },
    ],
    userStreak: 12,
    userGoal: 'Band 7+',
    userName: 'Alex Johnson',
  });
}