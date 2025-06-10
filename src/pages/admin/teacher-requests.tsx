// src/pages/admin/teacher-requests.tsx

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '@/lib/supabaseClient';

type Profile = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  year_of_education: string;
  subject?: string;
};

export default function TeacherRequestsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState<Profile[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Redirect non-admins
  useEffect(() => {
    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace('/login');
        return;
      }

      const { data: me, error: meError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (meError || me?.role !== 'admin') {
        router.replace('/');
      } else {
        fetchRequests();
      }
    })();
  }, [router]);

  // Fetch pending teacher sign-ups
  const fetchRequests = async () => {
    setLoading(true);
    setError(null);

    const { data, error } = await supabase
      .from('profiles')
      .select('id, first_name, last_name, email, year_of_education, subject')
      .eq('role', 'teacher')
      .eq('status', 'pending');

    if (error) {
      setError(error.message);
      setRequests([]);
    } else {
      setRequests(data as Profile[] || []);
    }

    setLoading(false);
  };

  // Approve a single request
  const handleApprove = async (id: string) => {
    setError(null);

    const { error } = await supabase
      .from('profiles')
      .update({ status: 'active' })
      .eq('id', id);

    if (error) {
      setError(error.message);
    } else {
      fetchRequests();
    }
  };

  if (loading) return <p className="p-6">Loading…</p>;

  return (
    <div className="max-w-3xl mx-auto mt-8 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-semibold mb-4">Pending Teacher Requests</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}

      {requests.length === 0 ? (
        <p>No pending requests.</p>
      ) : (
        <ul className="space-y-4">
          {requests.map((r) => (
            <li key={r.id} className="flex justify-between items-center border p-4 rounded">
              <div>
                <p>
                  <strong>
                    {r.first_name} {r.last_name}
                  </strong>{' '}
                  ({r.email})
                </p>
                <p>Year: {r.year_of_education}</p>
                {r.subject && <p>Subject: {r.subject}</p>}
              </div>
              <button
                onClick={() => handleApprove(r.id)}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Approve
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
