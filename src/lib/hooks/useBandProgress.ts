import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useUser } from '@/context/UserContext';

type BandDataPoint = {
  date: string;
  Task1?: number;
  Task2?: number;
};

type ProgressTrackingResult = {
  success: boolean;
  error?: string;
};

export function useBandProgress(userId: string) {
  const [data, setData] = useState<BandDataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();

  useEffect(() => {
    async function fetchBandHistory() {
      if (!userId) return;

      setLoading(true);

      try {
        const { data: rows, error } = await supabase
          .from('writing_attempts')
          .select('created_at, band, prompt_text')
          .eq('user_id', userId)
          .order('created_at', { ascending: true });

        if (error) throw error;

        const formatted: BandDataPoint[] = rows.map((row: any) => {
          const date = new Date(row.created_at).toLocaleDateString('en-US', {
            month: 'short',
            day: '2-digit',
          });

          const isTask1 = row.prompt_text?.includes('Task 1') ?? true;

          return {
            date,
            Task1: isTask1 ? row.band : undefined,
            Task2: !isTask1 ? row.band : undefined,
          };
        });

        const combined: Record<string, BandDataPoint> = {};
        for (const entry of formatted) {
          const key = entry.date;
          if (!combined[key]) combined[key] = { date: key };
          if (entry.Task1) combined[key].Task1 = entry.Task1;
          if (entry.Task2) combined[key].Task2 = entry.Task2;
        }

        setData(Object.values(combined));
      } catch (error) {
        console.error('❌ Error fetching band data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchBandHistory();
  }, [userId]);

  const trackLessonProgress = async (lessonId: string): Promise<ProgressTrackingResult> => {
    if (!user?.id) {
      return { success: false, error: 'User not authenticated' };
    }

    try {
      const response = await fetch('/api/track-progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          lessonId,
          activityType: 'lesson_completed'
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        return { success: false, error: errorData.message || 'Failed to track progress' };
      }

      return { success: true };
    } catch (error) {
      console.error('Progress tracking failed:', error);
      return { success: false, error: 'Network error occurred' };
    }
  };

  return {
    data,
    loading,
    trackLessonProgress
  };
}