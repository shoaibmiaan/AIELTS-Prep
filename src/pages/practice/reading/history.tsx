'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Download, ChevronDown } from 'lucide-react';

interface Attempt {
  id: number;
  test_id: string;
  submitted_at: string;
  answers: Record<string, string>;
  correct_answers: Record<string, string>;
}

interface Test {
  id: string;
  title: string;
}

export default function ReadingHistoryPage() {
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [tests, setTests] = useState<Record<string, Test>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'date' | 'score'>('date');
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) {
          router.push('/login');
          return;
        }

        const { data: atts, error: attsError } = await supabase
          .from('reading_attempts')
          .select('id, test_id, submitted_at, answers')
          .eq('user_id', user.id)
          .order('submitted_at', { ascending: false });

        if (attsError) throw attsError;

        const attemptsData = atts?.map(a => ({
          ...a,
          answers: JSON.parse(a.answers || '{}'),
          correct_answers: {},
        })) || [];

        const testIds = [...new Set(atts?.map(a => a.test_id) || [])];
        if (testIds.length) {
          const { data: testList, error: testError } = await supabase
            .from('reading_papers')
            .select('id, title')
            .eq('status', 'published')
            .in('id', testIds);

          if (testError) throw testError;

          const lookup: Record<string, Test> = {};
          testList?.forEach(t => (lookup[t.id] = t));
          setTests(lookup);

          const updatedAttempts = await Promise.all(
            atts?.map(async (a: any) => {
              const { data: questions, error: qError } = await supabase
                .from('reading_questions')
                .select('id, answer')
                .eq('paper_id', a.test_id)
                .eq('status', 'published');

              if (qError) throw qError;

              const correctAnswers: Record<string, string> = {};
              questions?.forEach(q => {
                try {
                  const answer = JSON.parse(q.answer);
                  correctAnswers[q.id] = Array.isArray(answer) ? answer[0] : answer;
                } catch (err) {
                  console.error(`Failed to parse answer for question ${q.id}:`, err);
                }
              });
              return {
                ...a,
                answers: JSON.parse(a.answers || '{}'),
                correct_answers: correctAnswers,
              };
            }) || []
          );

          setAttempts(updatedAttempts);
        }
      } catch (err: any) {
        setError(err.message || 'Error fetching history.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  const exportToCSV = () => {
    const headers = ['Date', 'Test Title', 'Score', 'Band'];
    const rows = attempts.map(a => {
      let correct = 0, total = 0;
      Object.keys(a.correct_answers).forEach(qn => {
        total++;
        if (a.answers[qn]?.trim().toLowerCase() === a.correct_answers[qn]?.trim().toLowerCase()) correct++;
      });
      const band = Math.min(9, Math.max(1, (correct / total) * 9));
      return [
        new Date(a.submitted_at).toLocaleString(),
        tests[a.test_id]?.title || a.test_id,
        `${correct}/${total}`,
        band.toFixed(1),
      ];
    });

    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'reading_history.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const sortedAttempts = [...attempts].sort((a, b) => {
    if (sortBy === 'score') {
      const scoreA = Object.keys(a.correct_answers).reduce(
        (sum, qn) => sum + (a.answers[qn]?.trim().toLowerCase() === a.correct_answers[qn]?.trim().toLowerCase() ? 1 : 0),
        0
      );
      const scoreB = Object.keys(b.correct_answers).reduce(
        (sum, qn) => sum + (b.answers[qn]?.trim().toLowerCase() === b.correct_answers[qn]?.trim().toLowerCase() ? 1 : 0),
        0
      );
      return scoreB - scoreA;
    }
    return new Date(b.submitted_at).getTime() - new Date(a.submitted_at).getTime();
  });

  if (error) {
    return (
      <motion.div
        className="p-10 text-center text-red-600 dark:text-red-400"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {error}
      </motion.div>
    );
  }

  if (loading) {
    return <motion.div className="p-10 text-center text-gray-600 dark:text-gray-300">Loading history...</motion.div>;
  }

  return (
    <motion.div
      className="max-w-4xl mx-auto p-8 bg-gray-50 dark:bg-gray-900 min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-800 dark:text-blue-300">My IELTS Reading History</h1>
      <div className="flex justify-between mb-4">
        <select
          className="px-4 py-2 border rounded-lg dark:bg-gray-800 dark:text-gray-300"
          onChange={e => setSortBy(e.target.value as 'date' | 'score')}
          aria-label="Sort history"
        >
          <option value="date">Sort by Date</option>
          <option value="score">Sort by Score</option>
        </select>
        <button
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          onClick={exportToCSV}
          aria-label="Export history to CSV"
        >
          <Download size={20} />
          Export CSV
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left bg-white dark:bg-gray-800 shadow rounded-lg" role="grid">
          <thead>
            <tr role="row">
              <th className="px-4 py-2" scope="col">Date</th>
              <th className="px-4 py-2" scope="col">Test</th>
              <th className="px-4 py-2" scope="col">Score</th>
              <th className="px-4 py-2" scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedAttempts.map(a => {
              let correct = 0, total = 0;
              Object.keys(a.correct_answers).forEach(qn => {
                total++;
                if (a.answers[qn]?.trim().toLowerCase() === a.correct_answers[qn]?.trim().toLowerCase()) correct++;
              });
              return (
                <tr key={a.id} className="border-t dark:border-gray-700" role="row">
                  <td className="px-4 py-2 text-gray-700 dark:text-gray-300">{new Date(a.submitted_at).toLocaleString()}</td>
                  <td className="px-4 py-2 text-blue-600 dark:text-blue-400 font-medium">{tests[a.test_id]?.title || 'Untitled'}</td>
                  <td className="px-4 py-2 font-bold text-green-600 dark:text-green-400">{total ? `${correct}/${total}` : '—'}</td>
                  <td className="px-4 py-2">
                    <button
                      className="text-indigo-600 dark:text-indigo-400 underline hover:text-indigo-800"
                      onClick={() => router.push(`/practice/reading/result?testId=${a.test_id}`)}
                      aria-label={`View result for ${tests[a.test_id]?.title || 'test'}`}
                    >
                      View Result
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="mt-8 flex gap-4 justify-center">
        <button
          className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          onClick={() => router.push('/practice/reading')}
          aria-label="Try another reading test"
        >
          Try Another Test
        </button>
        <button
          className="px-5 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
          onClick={() => router.push('/dashboard')}
          aria-label="Back to dashboard"
        >
          Back to Dashboard
        </button>
      </div>
    </motion.div>
  );
}