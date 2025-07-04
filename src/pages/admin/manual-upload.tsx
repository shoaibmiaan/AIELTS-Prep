'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Layout from '@/layouts/SidebarLayout';

export default function ManualReadingUpload() {
  const [jsonInput, setJsonInput] = useState('');
  const [preview, setPreview] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  const handlePreview = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      if (!parsed.title || !Array.isArray(parsed.passages)) {
        alert('❌ Invalid JSON format. "title" and "passages[]" required.');
        return;
      }
      setPreview(parsed);
    } catch (_e) {
      alert('❌ JSON parse error. Please fix formatting.');
      setPreview(null);
    }
  };

  const handleUpload = async () => {
    if (!preview) {
      alert('❌ Please preview valid JSON first.');
      return;
    }

    setLoading(true);
    const { error } = await supabase.from('reading_papers').insert({
      title: preview.title,
      data: preview,
    });

    if (error) {
      console.error('Supabase insert failed:', error);
      alert('❌ Failed to upload to Supabase');
    } else {
      alert('✅ Uploaded to Supabase!');
    }

    setLoading(false);
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-6">
        <h2 className="text-2xl font-bold mb-4">📘 Manual Reading Paper Upload</h2>

        <textarea
          value={jsonInput}
          onChange={(e) => setJsonInput(e.target.value)}
          placeholder='Paste full JSON here...'
          className="w-full h-72 p-3 border rounded font-mono"
        />

        <div className="mt-4 space-x-4">
          <button
            onClick={handlePreview}
            className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-800"
          >
            👁️ Preview
          </button>

          <button
            onClick={handleUpload}
            disabled={loading || !preview}
            className={`px-4 py-2 rounded text-white ${
              loading || !preview ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {loading ? 'Uploading...' : '⬆ Upload to Supabase'}
          </button>
        </div>

        {preview && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-2">🔍 Preview Parsed JSON</h3>
            <pre className="bg-gray-100 p-4 overflow-auto max-h-[400px] text-sm">
              {JSON.stringify(preview, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </Layout>
  );
}
