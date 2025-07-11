import { supabase } from './supabaseClient';

export const trackLessonCompletion = async (
  userId: string,
  courseId: string,
  lessonId: string
) => {
  try {
    // Update user progress
    const { error: progressError } = await supabase
      .from('user_progress')
      .upsert({
        user_id: userId,
        course_id: courseId,
        last_completed_lesson: lessonId,
        completed_at: new Date().toISOString()
      });

    if (progressError) throw progressError;

    // Update study streak
    const { error: streakError } = await supabase.rpc('update_study_streak', {
      user_id: userId
    });

    if (streakError) throw streakError;

    // Log study activity
    const { error: activityError } = await supabase
      .from('study_activities')
      .insert({
        user_id: userId,
        activity_type: 'lesson_completed',
        lesson_id: lessonId,
        course_id: courseId,
        duration_minutes: 30 // Replace with actual duration
      });

    return !(progressError || streakError || activityError);
  } catch (error) {
    console.error('Progress tracking failed:', error);
    return false;
  }
};