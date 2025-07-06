// lib/studyActivity.ts

import { supabase } from './supabaseClient';

/**
 * Logs the study activity of a user.
 * @param userId - The ID of the logged-in user.
 * @param activityType - The type of study activity, e.g., "Listening Test", "Reading Test", etc.
 */
export const logStudyActivity = async (userId: string, activityType: string) => {
  const { data, error } = await supabase
    .from('study_activity')
    .insert([
      {
        user_id: userId,
        study_date: new Date().toISOString().split('T')[0], // Format as YYYY-MM-DD
        activity_type: activityType,
      },
    ]);

  if (error) {
    console.error('Error logging study activity:', error);
    return;
  }

  console.log('Study activity logged:', data);
};
