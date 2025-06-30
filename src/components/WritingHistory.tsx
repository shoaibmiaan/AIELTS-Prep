// src/components/WritingHistory.tsx
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

interface Attempt {
  id: string;
  prompt_text: string;
  band: number | null;
  duration_seconds: number | null;
  created_at: string;
}

export default function WritingHistory() {
  const [attempts, setAttempts] = useState<Attempt[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data: authData, error: authError } = await supabase.auth.getUser();
      if (authError || !authData?.user) return;

      const { data, error } = await supabase
        .from('writing_attempts')
        .select('*')
        .eq('user_id', authData.user.id)
        .order('created_at', { ascending: false });

      if (!error && data) {
        setAttempts(data);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">📝 Writing Attempt History</h1>
      {attempts.length === 0 ? (
        <p className="text-gray-500">No writing attempts yet.</p>
      ) : (
        <div className="space-y-4">
          {attempts.map((entry) => (
            <div
              key={entry.id}
              className="border border-gray-200 rounded p-4 bg-white shadow"
            >
              <p className="text-sm text-gray-500">
                🕒 {new Date(entry.created_at).toLocaleString()}
              </p>
              <p className="font-semibold mt-1">📌 Prompt: {entry.prompt_text}</p>
              <p className="text-sm mt-1">🎯 Band: {entry.band ?? 'N/A'}</p>
              <p className="text-sm">⏱️ Duration: {entry.duration_seconds ?? 'N/A'} seconds</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
