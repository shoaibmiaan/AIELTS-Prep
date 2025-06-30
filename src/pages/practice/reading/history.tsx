'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/router';

export default function ReadingHistoryPage() {
  const [attempts, setAttempts] = useState<any[]>([]);
  const [tests, setTests] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  // Fetch user and attempts
  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }
      setUser(user);
      // Get all attempts for user
      const { data: atts } = await supabase
        .from('reading_attempts')
        .select('*')
        .eq('user_id', user.id)
        .order('submitted_at', { ascending: false });
      setAttempts(atts || []);
      // Fetch all referenced tests in one go
      const testIds = [...new Set((atts || []).map((a: any) => a.test_id))];
      if (testIds.length) {
        const { data: testList } = await supabase
          .from('reading_papers')
          .select('id, title')
          .in('id', testIds);
        const lookup: Record<string, any> = {};
        (testList || []).forEach((t: any) => { lookup[t.id] = t; });
        setTests(lookup);
      }
      setLoading(false);
    })();
  }, []);

  if (loading) return <div className="p-10 text-lg">Loading your history...</div>;

  if (!user)
    return (
      <div className="p-8 text-red-600 text-lg">Please login to view your reading history.</div>
    );

  if (!attempts.length)
    return (
      <div className="p-8 text-lg">
        <b>No attempts found.</b>
        <br />
        Start a new IELTS Reading test from the <a href="/practice/reading" className="text-blue-700 underline">Practice Reading</a> page.
      </div>
    );

  return (
    <div className="max-w-3xl mx-auto p-8 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-center text-blue-800">My IELTS Reading Test History</h1>
      <div className="overflow-x-auto">
        <table className="w-full text-left bg-white shadow rounded-xl">
          <thead>
            <tr>
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Test</th>
              <th className="px-4 py-2">Score</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {attempts.map((a) => {
              let correct = 0;
              let total = 0;
              const correctAnswers = a.correct_answers || {};
              if (a.answers && correctAnswers && Object.keys(correctAnswers).length) {
                Object.keys(correctAnswers).forEach(qn => {
                  total++;
                  if (
                    a.answers[qn]?.trim()?.toLowerCase() === correctAnswers[qn]?.trim()?.toLowerCase()
                  ) {
                    correct++;
                  }
                });
              }
              return (
                <tr key={a.id} className="border-t">
                  <td className="px-4 py-2 text-gray-700">{a.submitted_at ? new Date(a.submitted_at).toLocaleString() : ''}</td>
                  <td className="px-4 py-2 text-blue-800 font-medium">
                    {tests[a.test_id]?.title || a.test_id}
                  </td>
                  <td className="px-4 py-2 font-bold text-green-700">
                    {total ? `${correct} / ${total}` : '—'}
                  </td>
                  <td className="px-4 py-2">
                    <button
                      className="text-indigo-700 underline hover:font-bold"
                      onClick={() => router.push(`/practice/reading/result?testId=${a.test_id}`)}
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
          className="bg-blue-700 hover:bg-blue-900 text-white px-5 py-2 rounded-2xl shadow"
          onClick={() => router.push('/practice/reading')}
        >
          ➕ Try Another Reading Test
        </button>
        <button
          className="bg-green-600 hover:bg-green-800 text-white px-5 py-2 rounded-2xl shadow"
          onClick={() => router.push('/dashboard')}
        >
          🏠 Back to Dashboard
        </button>
      </div>
    </div>
  );
}
