import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

type BandDataPoint = {
  date: string;
  Task1?: number;
  Task2?: number;
};

export function useBandProgress(userId: string) {
  const [data, setData] = useState<BandDataPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBandHistory() {
      if (!userId) return;

      setLoading(true);

      const { data: rows, error } = await supabase
        .from('writing_attempts')
        .select('created_at, band, prompt_text')
        .eq('user_id', userId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('❌ Error fetching band data:', error);
        setLoading(false);
        return;
      }

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
      setLoading(false);
    }

    fetchBandHistory();
  }, [userId]);

  return { data, loading };
}
