import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { toast } from 'react-hot-toast';
import Link from 'next/link';

type ListeningRecord = {
  id: string;
  set_id: number;
  score: number;
  feedback: string;
  answers: Record<string, string>;
  created_at: string;
};

export default function ListeningHistory() {
  const [records, setRecords] = useState<ListeningRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (!user || userError) {
        toast.error('Please log in to view your history.');
        return;
      }

      const { data, error } = await supabase
        .from('listening_history')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching history:', error);
        toast.error('Failed to fetch listening history.');
      } else {
        setRecords(data || []);
      }

      setLoading(false);
    };

    fetchHistory();
  }, []);

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">📜 Listening Practice History</h1>

      {loading ? (
        <p>Loading...</p>
      ) : records.length === 0 ? (
        <p className="text-gray-600">No practice history found yet.</p>
      ) : (
        <ul className="space-y-4">
          {records.map((record) => (
            <li key={record.id} className="border rounded p-4 bg-gray-50">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Set ID: {record.set_id}</span>
                <span>{new Date(record.created_at).toLocaleString()}</span>
              </div>
              <p className="text-gray-800 mb-2"><strong>Score:</strong> {record.score}</p>
              <details className="text-sm text-gray-700">
                <summary className="cursor-pointer text-blue-600 underline">Show Feedback</summary>
                <pre className="whitespace-pre-wrap mt-2">{record.feedback}</pre>
              </details>
            </li>
          ))}
        </ul>
      )}

      <Link href="/practice/listening" className="mt-6 inline-block text-blue-600 hover:underline">
        🎧 Back to Listening Practice
      </Link>
    </div>
  );
}
