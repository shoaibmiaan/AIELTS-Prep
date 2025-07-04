'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Layout from '@/components/layouts/Layout';

type Subscriber = {
  id: string;
  name: string;
  email: string;
  created_at: string;
  source?: string; // ✅ added source
};

export default function SubscribersPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);

  useEffect(() => {
    async function fetchData() {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('id, name, email, created_at, source') // ✅ include source
        .order('created_at', { ascending: false });

      if (error) {
        console.error(error);
        return;
      }

      setSubscribers(data as Subscriber[]);
    }

    fetchData();
  }, []);

  const exportCSV = () => {
    const csv = [
      ['Name', 'Email', 'Date', 'Source'], // ✅ add header
      ...subscribers.map(s => [s.name, s.email, s.created_at, s.source || ''])
    ]
      .map(row => row.join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `subscribers-${Date.now()}.csv`;
    link.click();
  };

  return (
    <Layout>
      <div className="max-w-5xl mx-auto p-6">
        {/* Breadcrumb */}
        <div className="text-sm text-gray-600 mb-2">Admin &gt; Subscribers</div>

        <h1 className="text-2xl font-bold mb-4">📧 Subscribers</h1>

        <button
          onClick={exportCSV}
          className="mb-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Export CSV
        </button>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b bg-gray-100 font-semibold">
                <th className="p-2">Name</th>
                <th className="p-2">Email</th>
                <th className="p-2">Subscribed At</th>
                <th className="p-2">Source</th> {/* ✅ new column */}
              </tr>
            </thead>
            <tbody>
              {subscribers.map(sub => (
                <tr key={sub.id} className="border-b">
                  <td className="p-2">{sub.name}</td>
                  <td className="p-2">{sub.email}</td>
                  <td className="p-2">
                    {new Date(sub.created_at).toLocaleString()}
                  </td>
                  <td className="p-2 text-gray-700">{sub.source || 'N/A'}</td> {/* ✅ value */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}
