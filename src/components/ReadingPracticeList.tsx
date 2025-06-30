'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';

type Paper = {
  id: string;
  title: string;
  type: string;
  instructions?: string;
};

export default function ReadingPracticeList() {
  const [papers, setPapers] = useState<Paper[]>([]);

  useEffect(() => {
    async function loadPapers() {
      const { data, error } = await supabase
        .from('reading_papers')
        .select('id, title, type, instructions')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Failed to load papers:', error.message);
      } else {
        setPapers(data);
      }
    }

    loadPapers();
  }, []);

  return (
    <ul className="space-y-4">
      {papers.map((paper) => (
        <li key={paper.id}>
          <Link href={`/practice/reading/${paper.id}`}>
            <div className="p-4 border rounded shadow hover:bg-gray-50">
              <h3 className="font-bold">{paper.title}</h3>
              <p className="text-sm text-gray-600 capitalize">{paper.type}</p>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
