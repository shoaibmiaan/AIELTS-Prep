// src/lib/logging.ts
import { supabase } from './supabaseClient';

// Function to log study activity
export const logStudyActivity = async (userId: string, activity: string) => {
  try {
    // Validate inputs to ensure they are not empty or undefined
    if (!userId || !activity) {
      throw new Error('User ID or activity is missing');
    }

    // Insert the activity into the 'study_activities' table in Supabase
    const { data, error } = await supabase
      .from('study_activities') // Using plural table name as specified
      .insert([
        {
          user_id: userId,
          activity: activity,
          timestamp: new Date().toISOString(), // Using ISO string format for timestamp
        },
      ]);

    // Check for any errors during the insert
    if (error) {
      console.error('Error inserting study activity:', error.message);
      throw new Error(error.message);
    }

    // Log success (optional for debugging)
    console.log('Activity logged successfully:', data);
  } catch (error) {
    console.error('Error logging study activity:', error);
  }
};