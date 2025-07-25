// src/components/StudyStreak.tsx
'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function StudyStreak({ userId }: { userId: string }) {
  const [streak, setStreak] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStreak = async () => {
      if (!userId) return;
      
      try {
        const { data, error: fetchError } = await supabase
          .from('profiles')
          .select('current_streak')
          .eq('id', userId)
          .single(); // Use single() to ensure only one row is returned

        if (fetchError) {
          throw fetchError;
        }

        if (data) {
          setStreak(data.current_streak);
        } else {
          setStreak(0);
        }
      } catch (error) {
        console.error('Error fetching streak:', error);
        setError('Failed to load streak data');
      }
    };

    fetchStreak();
  }, [userId]);

  if (error) {
    return <div className="text-red-500 text-xs">{error}</div>;
  }

  return (
    <div className="text-xs bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 px-2 py-1 rounded-full flex items-center">
      🔥 {streak !== null ? `${streak}-day streak` : 'Loading...'}
    </div>
  );
}