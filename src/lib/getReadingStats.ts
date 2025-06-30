import { supabase } from './supabaseClient';

export async function getUserReadingStats(userId: string) {
  const { data, error } = await supabase
    .from('reading_attempts')
    .select('band_score')
    .eq('user_id', userId);

  if (error || !data) return { averageBand: null, attempts: 0 };

  const total = data.reduce((sum, attempt) => sum + (attempt.band_score || 0), 0);
  const avg = data.length > 0 ? parseFloat((total / data.length).toFixed(1)) : null;

  return { averageBand: avg, attempts: data.length };
}
