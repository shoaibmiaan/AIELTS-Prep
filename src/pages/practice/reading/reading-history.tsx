'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

interface Attempt {
  id: string;
  paper_id: string;
  raw_score: number;
  band_score: number;
  ai_feedback: string;
  created_at: string;
  paper_title?: string;
}

type BandFilter = 'all' | 'lt5' | 'btw5_7' | 'gte7';

export default function ReadingHistoryPage() {
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [filtered, setFiltered] = useState<Attempt[]>([]);
  const [bandFilter, setBandFilter] = useState<BandFilter>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAttempts() {
      const {
        data: userResult,
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !userResult.user) return;

      const { data, error } = await supabase
        .from('reading_attempts')
        .select(`
          id, paper_id, raw_score, band_score, ai_feedback, created_at,
          reading_papers ( title )
        `)
        .eq('user_id', userResult.user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Failed to load attempts:', error.message);
      } else {
        const enriched = data.map((a) => ({
          ...a,
          paper_title: a.reading_papers?.title ?? 'Untitled',
        }));
        setAttempts(enriched);
        setFiltered(enriched);
      }

      setLoading(false);
    }

    loadAttempts();
  }, []);

  const avgBand =
    attempts.reduce((sum, a) => sum + a.band_score, 0) / attempts.length || 0;

  const applyFilter = (filter: BandFilter) => {
    setBandFilter(filter);
    let newList = [...attempts];
    if (filter === 'lt5') {
      newList = attempts.filter((a) => a.band_score < 5);
    } else if (filter === 'btw5_7') {
      newList = attempts.filter((a) => a.band_score >= 5 && a.band_score < 7);
    } else if (filter === 'gte7') {
      newList = attempts.filter((a) => a.band_score >= 7);
    }
    setFiltered(newList);
  };

  return (
    <main className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">📘 Reading Test History</h1>

      {loading ? (
        <p>Loading...</p>
      ) : attempts.length === 0 ? (
        <p>No attempts yet.</p>
      ) : (
        <>
          <div className="mb-6 space-y-1">
            <p>
              <strong>Total Attempts:</strong> {attempts.length}
            </p>
            <p>
              <strong>Average Band:</strong>{' '}
              <span
                className={
                  avgBand < 5
                    ? 'text-red-600'
                    : avgBand < 7
                    ? 'text-yellow-600'
                    : 'text-green-600'
                }
              >
                {avgBand.toFixed(1)}
              </span>
            </p>
          </div>

          <div className="mb-6">
            <label className="block mb-2 font-semibold">🎯 Filter by Band:</label>
            <div className="flex flex-wrap gap-2">
              <button
                className={`px-3 py-1 border rounded ${
                  bandFilter === 'all' ? 'bg-blue-600 text-white' : ''
                }`}
                onClick={() => applyFilter('all')}
              >
                All
              </button>
              <button
                className={`px-3 py-1 border rounded ${
                  bandFilter === 'lt5' ? 'bg-red-600 text-white' : ''
                }`}
                onClick={() => applyFilter('lt5')}
              >
                Band &lt; 5
              </button>
              <button
                className={`px-3 py-1 border rounded ${
                  bandFilter === 'btw5_7' ? 'bg-yellow-500 text-white' : ''
                }`}
                onClick={() => applyFilter('btw5_7')}
              >
                5.0 – 6.9
              </button>
              <button
                className={`px-3 py-1 border rounded ${
                  bandFilter === 'gte7' ? 'bg-green-600 text-white' : ''
                }`}
                onClick={() => applyFilter('gte7')}
              >
                Band ≥ 7
              </button>
            </div>
          </div>

          <ul className="space-y-4">
            {filtered.map((a) => (
              <li key={a.id} className="border rounded p-4 shadow-sm">
                <h3 className="font-semibold text-lg">{a.paper_title}</h3>
                <p className="text-sm text-gray-600 mb-1">
                  Attempted: {new Date(a.created_at).toLocaleString()}
                </p>
                <p>
                  ✅ Score: {a.raw_score} | 🎯 Band:{' '}
                  <span
                    className={
                      a.band_score < 5
                        ? 'text-red-600'
                        : a.band_score < 7
                        ? 'text-yellow-600'
                        : 'text-green-600'
                    }
                  >
                    {a.band_score}
                  </span>
                </p>
                <details className="mt-2">
                  <summary className="cursor-pointer text-blue-600 underline">
                    Show AI Feedback
                  </summary>
                  <p className="mt-2 whitespace-pre-wrap">{a.ai_feedback}</p>
                </details>
              </li>
            ))}
          </ul>
        </>
      )}
    </main>
  );
}
