// src/pages/admin/pdf-importer.tsx
'use client';

import React from 'react';
import ReadingImporterClient from '@/components/admin/ReadingImporterClient';
import Layout from '@/components/Layout';

export default function Page() {
  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 p-6">
        <ReadingImporterClient />
      </div>
    </Layout>
  );
}
