'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

/**
 * Component to display the current study streak.
 */
const StudyStreak = ({ userId }: { userId: string }) => {
  const [streak, setStreak] = useState<number>(0);

  useEffect(() => {
    // Async function to fetch study streak
    const fetchStudyStreak = async () => {
      if (!userId) return; // Return early if userId is not available

      try {
        const { data, error } = await supabase
          .from('study_activity')
          .select('study_date')
          .eq('user_id', userId)
          .order('study_date', { ascending: false });

        if (error || !data) {
          console.error('Error fetching study streak:', error);
          return;
        }

        let streakCount = 1;
        let lastStudyDate = new Date(data[0].study_date);

        // Calculate streak based on consecutive study dates
        for (let i = 1; i < data.length; i++) {
          const currentStudyDate = new Date(data[i].study_date);
          const timeDiff = (lastStudyDate.getTime() - currentStudyDate.getTime()) / (1000 * 3600 * 24);

          if (timeDiff === 1) {
            streakCount++;
          } else if (timeDiff > 1) {
            break; // Break if there's a gap larger than 1 day
          }

          lastStudyDate = currentStudyDate;
        }

        setStreak(streakCount); // Update streak state
      } catch (error) {
        console.error('Error fetching study streak:', error);
      }
    };

    fetchStudyStreak(); // Invoke async function
  }, [userId]); // Dependency array: re-run when `userId` changes

  return (
    <div className="text-center">
      <p>Your current study streak: <span className="font-bold">{streak} days</span></p>
    </div>
  );
};

export default StudyStreak;
