// /pages/practice/listening/index.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '@/lib/supabaseClient';

export default function ListeningHomePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleStart = async () => {
    setLoading(true);
    setError('');

    try {
      const {
        data: { user },
        error: userErr,
      } = await supabase.auth.getUser();

      if (userErr || !user) throw new Error('User not authenticated');

      const allTestIds = ['test01', 'test02', 'test03'];

      const { data: attempts, error: attemptsError } = await supabase
        .from('listening_attempts')
        .select('test_id')
        .eq('user_id', user.id);

      if (attemptsError) throw attemptsError;

      const attemptedIds = attempts?.map(a => a.test_id) || [];
      const unattempted = allTestIds.filter(id => !attemptedIds.includes(id));

      const nextTestId = unattempted.length > 0
        ? unattempted[Math.floor(Math.random() * unattempted.length)]
        : allTestIds[Math.floor(Math.random() * allTestIds.length)];

      router.push(`/practice/listening/test/${nextTestId}`);
    } catch (err: any) {
      console.error('Start test error:', err.message);
      setError('⚠️ Failed to start test. Make sure you are logged in.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="container mx-auto py-16 px-6 max-w-3xl bg-white rounded-xl shadow">
        <h1 className="text-3xl font-bold text-center mb-6">Welcome to the IELTS Listening Test</h1>
        <p className="text-center text-gray-600 mb-8">
          This is a <strong>computer-based</strong> exam. Please read all instructions carefully before you begin.
        </p>

        <ul className="list-disc list-inside space-y-2 text-gray-700 mb-8">
          <li>You will hear each recording <strong>once only</strong>. It will not replay.</li>
          <li>Read the questions on screen <strong>before</strong> you listen.</li>
          <li>Use the volume control to adjust playback, but you cannot replay the audio.</li>
          <li>Type your answers into the text fields or select the appropriate option for MCQs.</li>
          <li>After the final recording, you will have <strong>2 minutes</strong> to review your answers.</li>
          <li>When you're ready, click <strong>Start Test</strong> to begin.</li>
        </ul>

        {error && (
          <p className="text-red-600 text-center mb-4">{error}</p>
        )}

        <div className="text-center">
          <button
            onClick={handleStart}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-md transition"
          >
            {loading ? 'Starting...' : 'Start Test'}
          </button>
          <p className="text-gray-500 mt-2 italic">Good luck!</p>
        </div>
      </main>
    </div>
  );
}
