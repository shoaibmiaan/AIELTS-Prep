'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

type Request = {
  id: string;
  full_name: string;
  email: string;
};

export default function TeacherRequestsPage() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    const { data: profiles, error: _ } = await supabase
      .from('profiles')
      .select('id, full_name, role')
      .eq('role', 'pending_teacher');

    const { data: users } = await supabase.from('users').select('id, email');

    const emailMap = new Map(users?.map((u) => [u.id, u.email]));
    const enriched = profiles?.map((p) => ({
      ...p,
      email: emailMap.get(p.id) || '',
    }));

    setRequests(enriched || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleAction = async (id: string, action: 'approve' | 'reject') => {
    const newRole = action === 'approve' ? 'teacher' : 'student';
    const { error } = await supabase
      .from('profiles')
      .update({ role: newRole })
      .eq('id', id);

    if (error) {
      console.error('Failed to update role:', error.message);
      return;
    }

    fetchRequests();
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">📩 Teacher Access Requests</h1>

      {loading ? (
        <p>Loading requests…</p>
      ) : requests.length === 0 ? (
        <p className="text-gray-600">No pending requests.</p>
      ) : (
        <table className="w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left p-2 border">Full Name</th>
              <th className="text-left p-2 border">Email</th>
              <th className="text-left p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((req) => (
              <tr key={req.id} className="border-b">
                <td className="p-2">{req.full_name}</td>
                <td className="p-2">{req.email}</td>
                <td className="p-2">
                  <button
                    onClick={() => handleAction(req.id, 'approve')}
                    className="text-green-700 hover:underline mr-4"
                  >
                    ✅ Approve
                  </button>
                  <button
                    onClick={() => handleAction(req.id, 'reject')}
                    className="text-red-600 hover:underline"
                  >
                    ❌ Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
