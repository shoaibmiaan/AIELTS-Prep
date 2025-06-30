'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';

type ReadingPaper = {
  id: string;
  title: string;
  type: string;
  status: string;
  created_at: string;
  passage_count: number;
  question_count: number;
};

export default function UploadReadingTests() {
  const [papers, setPapers] = useState<ReadingPaper[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReadingPapers = async () => {
      const { data, error } = await supabase
        .from('reading_papers')
        .select(`
          id,
          title,
          type,
          status,
          created_at,
          reading_passages!inner(id),
          reading_questions!inner(id)
        `)
        .order('created_at', { ascending: false });

      if (error) console.error('Error fetching papers:', error);
      else {
        const formattedPapers = data.map((paper: any) => ({
          id: paper.id,
          title: paper.title,
          type: paper.type,
          status: paper.status,
          created_at: new Date(paper.created_at).toLocaleDateString(),
          passage_count: paper.reading_passages.length,
          question_count: paper.reading_questions.length,
        }));
        setPapers(formattedPapers);
      }
      setLoading(false);
    };

    fetchReadingPapers();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 space-y-10">
      <div className="text-sm text-gray-500 mb-2">
        <span className="text-gray-400">Admin</span> {'>'} <span className="font-semibold text-gray-700">Upload Reading Tests</span>
      </div>

      <h1 className="text-3xl font-bold">📘 Upload Reading Tests</h1>

      <div className="mb-6">
        <Link href="/admin/manual-upload" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Upload New Test
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 border-b">Title</th>
              <th className="py-2 px-4 border-b">Type</th>
              <th className="py-2 px-4 border-b">Status</th>
              <th className="py-2 px-4 border-b">Created At</th>
              <th className="py-2 px-4 border-b">Passages</th>
              <th className="py-2 px-4 border-b">Questions</th>
              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {papers.map((paper) => (
              <tr key={paper.id} className="hover:bg-gray-50">
                <td className="py-2 px-4 border-b">{paper.title}</td>
                <td className="py-2 px-4 border-b">{paper.type}</td>
                <td className="py-2 px-4 border-b">{paper.status}</td>
                <td className="py-2 px-4 border-b">{paper.created_at}</td>
                <td className="py-2 px-4 border-b">{paper.passage_count}</td>
                <td className="py-2 px-4 border-b">{paper.question_count}</td>
                <td className="py-2 px-4 border-b">
                  <Link href={`/admin/edit-test/${paper.id}`} className="text-blue-500 hover:underline mr-2">Edit</Link>
                  <button className="text-red-500 hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
