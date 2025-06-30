import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

interface Submission {
  id: string;
  content: string;
  feedback: string | null;
  created_at: string;
}

export default function WritingHistory2() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const { data: authData, error: authError } = await supabase.auth.getUser();
      if (authError || !authData?.user) return;

      const { data, error } = await supabase
        .from('writing_submissions')
        .select('*')
        .eq('user_id', authData.user.id)
        .order('created_at', { ascending: false });

      if (!error && data) {
        setSubmissions(data);
      }
    };

    fetchData();
  }, []);

  const filteredSubmissions = submissions.filter((entry) => {
    const createdAt = new Date(entry.created_at);
    const contentMatch = entry.content.toLowerCase().includes(searchTerm.toLowerCase());
    const dateMatch = new Date(entry.created_at).toLocaleString().toLowerCase().includes(searchTerm.toLowerCase());

    const inStartRange = startDate ? createdAt >= new Date(startDate) : true;
    const inEndRange = endDate ? createdAt <= new Date(endDate) : true;

    return (contentMatch || dateMatch) && inStartRange && inEndRange;
  });

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">📜 My Writing History</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <input
          type="text"
          placeholder="🔍 Search by content or date..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded"
        />
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded"
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded"
        />
      </div>

      {filteredSubmissions.length === 0 ? (
        <p className="text-gray-500">No submissions match the filters.</p>
      ) : (
        filteredSubmissions.map((entry) => (
          <div
            key={entry.id}
            className="border border-gray-200 rounded p-4 mb-4 bg-white shadow"
          >
            <p className="text-sm text-gray-500 mb-2">
              Submitted on {new Date(entry.created_at).toLocaleString()}
            </p>
            <p className="mb-2 whitespace-pre-line">{entry.content}</p>
            <div className="text-sm text-green-700 border-t pt-2 mt-2">
              {entry.feedback ?? '⏳ Pending feedback. Please try again later.'}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
