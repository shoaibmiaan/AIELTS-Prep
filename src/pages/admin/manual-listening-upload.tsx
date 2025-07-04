'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Layout from '@/layouts/Layout';

export default function ManualListeningUpload() {
  const [jsonInput, setJsonInput] = useState('');
  const [preview, setPreview] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  // --- Step 1: Preview and Validate JSON ---
  const handlePreview = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      if (!parsed.title || !parsed.audio_src || !Array.isArray(parsed.sections)) {
        alert('❌ Invalid JSON format. "title", "audio_src" and "sections[]" required.');
        setPreview(null);
        return;
      }
      setPreview(parsed);
    } catch {
      alert('❌ JSON parse error. Please fix formatting.');
      setPreview(null);
    }
  };

  // --- Step 2: Upload to All Listening Tables ---
  const handleUpload = async () => {
    if (!preview) {
      alert('❌ Please preview valid JSON first.');
      return;
    }
    setLoading(true);

    try {
      // 1. Insert into listening_tests
      const { data: test, error: testError } = await supabase
        .from('listening_tests')
        .insert({
          title: preview.title,
          audio_src: preview.audio_src,
        })
        .select()
        .single();

      if (testError) throw testError;

      // 2. Insert sections and questions
      for (const section of preview.sections) {
        const { data: sectionRow, error: sectionError } = await supabase
          .from('listening_sections')
          .insert({
            test_id: test.id,
            section_number: section.section_number,
            instructions: section.instructions,
          })
          .select()
          .single();

        if (sectionError) throw sectionError;

        // Insert questions for this section
        for (const question of section.questions) {
          const { error: qError } = await supabase
            .from('listening_questions')
            .insert({
              section: section.section_number,
              question_number: question.question_number,
              question_text: question.question_text,
              question_type: question.question_type,
              options: question.options ?? null,
              correct_answer: question.correct_answer ?? null,
              transcript: question.transcript ?? null,
              audio_url: question.audio_url,
              timestamp: question.timestamp,
            });
          if (qError) throw qError;
        }
      }

      alert('✅ Listening test uploaded successfully!');
      setJsonInput('');
      setPreview(null);
    } catch (err: any) {
      console.error('Upload error:', err);
      alert(`❌ Upload failed: ${err.message || err.error_description || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-6">
        <h2 className="text-2xl font-bold mb-4">🎧 Manual Listening Test Upload</h2>

        <textarea
          value={jsonInput}
          onChange={(e) => setJsonInput(e.target.value)}
          placeholder='Paste full Listening JSON here...'
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
