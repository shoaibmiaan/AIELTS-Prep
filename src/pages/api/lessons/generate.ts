import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabaseClient';
import { generateDynamicLesson } from '@/services/aiLessonService';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import { Lesson } from '@/types';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { title, lessonType } = req.body;

  try {
    // Fetch user profile
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();

    if (error || !profile) {
      return res.status(404).json({ error: 'User profile not found' });
    }

    // Generate lesson content
    const aiContent = await generateDynamicLesson(profile, {
      title,
      type: lessonType
    });

    // Create lesson record
    const { data: lesson, error: dbError } = await supabase
      .from('lessons')
      .insert({
        title,
        content: aiContent,
        type: lessonType,
        ai_generated: true,
        owner: session.user.id,
        target_band: profile.target_band,
        focus_areas: profile.weaknesses
      })
      .select()
      .single();

    if (dbError) throw dbError;

    return res.status(200).json(lesson);
  } catch (error) {
    return res.status(500).json({
      error: 'Lesson generation failed',
      details: error.message
    });
  }
}