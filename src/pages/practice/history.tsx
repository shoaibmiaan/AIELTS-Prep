// src/pages/practice/history.tsx
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function WritingHistory() {
  const [submissions, setSubmissions] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('writing_submissions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (!error && data) {
        setSubmissions(data);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">📜 My Writing History</h1>
      {submissions.length === 0 ? (
        <p className="text-gray-500">No submissions yet.</p>
      ) : (
        submissions.map((entry) => (
          <div
            key={entry.id}
            className="border border-gray-200 rounded p-4 mb-4 bg-white shadow"
          >
            <p className="text-sm text-gray-500 mb-2">
              Submitted on {new Date(entry.created_at).toLocaleString()}
            </p>
            <p className="mb-2 whitespace-pre-line">{entry.content}</p>
            <div className="text-sm text-green-700 border-t pt-2 mt-2">
              {entry.feedback
                ? entry.feedback
                : '⏳ Pending feedback. Please try again later.'}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
