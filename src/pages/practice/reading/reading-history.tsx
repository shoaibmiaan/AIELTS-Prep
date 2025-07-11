'use client';
import { useEffect, useState, Suspense, lazy } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { motion } from 'framer-motion';
import { Download, Filter, BarChart2, AlertCircle } from 'lucide-react';

const ProgressChart = lazy(() => import('@/components/ProgressChart'));

interface Attempt {
  id: number;
  test_id: string;
  raw_score: number | null;
  band_score: number | null;
  ai_feedback: string | null;
  created_at: string;
  paper_title: string;
}

type BandFilter = 'all' | 'lt5' | 'btw5_7' | 'gte7';

export default function ReadingHistoryPage() {
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [filtered, setFiltered] = useState<Attempt[]>([]);
  const [bandFilter, setBandFilter] = useState<BandFilter>('all');
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({ start: '', end: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showChart, setShowChart] = useState(false);

  useEffect(() => {
    const loadAttempts = async () => {
      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) {
          setError('Please sign in to view history.');
          return;
        }

        const { data, error } = await supabase
          .from('reading_attempts')
          .select(`
            id, test_id, raw_score, band_score, ai_feedback, created_at,
            reading_papers ( title )
          `)
          .eq('user_id', user.id)
          .eq('reading_papers.status', 'published')
          .order('created_at', { ascending: false });

        if (error) throw error;

        const enriched = data?.map(a => ({
          ...a,
          paper_title: a.reading_papers?.title ?? 'Untitled',
        })) || [];
        setAttempts(enriched);
        setFiltered(enriched);
      } catch (err: any) {
        setError(err.message || 'Failed to load attempts.');
      } finally {
        setLoading(false);
      }
    };

    loadAttempts();
  }, []);

  useEffect(() => {
    let newList = [...attempts];
    if (bandFilter !== 'all') {
      newList = newList.filter(a => {
        if (!a.band_score) return false;
        if (bandFilter === 'lt5') return a.band_score < 5;
        if (bandFilter === 'btw5_7') return a.band_score >= 5 && a.band_score < 7;
        return a.band_score >= 7;
      });
    }
    if (dateRange.start && dateRange.end) {
      newList = newList.filter(a => {
        const date = new Date(a.created_at);
        return date >= new Date(dateRange.start) && date <= new Date(dateRange.end);
      });
    }
    setFiltered(newList);
  }, [bandFilter, dateRange, attempts]);

  const avgBand = attempts.length ? attempts.reduce((sum, a) => sum + (a.band_score || 0), 0) / attempts.length : 0;

  // Closing the function properly with return statement and closing bracket
  return (
    <div>
      {/* Render JSX content here */}
      {error && <div className="error">{error}</div>}
      <div>Average Band: {avgBand}</div>
      {/* Other JSX components */}
    </div>
  );
}
