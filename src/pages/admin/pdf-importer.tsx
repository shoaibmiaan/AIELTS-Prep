'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import ListeningImporterClient from '@/components/admin/ListeningImporterClient';
import Layout from '@/layouts/SidebarLayout';

const ReadingImporterClient = dynamic(
  () => import('@/components/admin/ReadingImporterClient'),
  { ssr: false }
);

const IMPORTER_OPTIONS = [
  { label: 'Listening Importer', value: 'listening' },
  { label: 'Reading Importer', value: 'reading' }
];

export default function Page() {
  const [selected, setSelected] = useState<'listening' | 'reading'>('listening');

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="mb-6 flex gap-4">
          {IMPORTER_OPTIONS.map(option => (
            <button
              key={option.value}
              className={`px-4 py-2 rounded-lg font-medium shadow-sm border transition ${
                selected === option.value
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-blue-100'
              }`}
              onClick={() => setSelected(option.value as 'listening' | 'reading')}
              type="button"
            >
              {option.label}
            </button>
          ))}
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-md">
          {selected === 'listening' && <ListeningImporterClient />}
          {selected === 'reading' && <ReadingImporterClient />}
        </div>
      </div>
    </Layout>
  );
}
