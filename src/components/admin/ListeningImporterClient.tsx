'use client';

import React, { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import listeningSchemaExample from '@/data/listening_test_schema_example.json';
import { DataGrid } from 'react-data-grid';
import 'react-data-grid/lib/styles.css';

interface ListeningQuestion {
  question_number: number;
  question_type: 'fill-blank' | 'mcq' | 'matching' | 'multi-mcq' | 'map';
  question_text: string;
  options: string[] | null;
  correct_answer: string | string[];
  transcript: string | null;
  audio_url: string;
  timestamp: number;
  section: number;
}
interface ListeningSection {
  section_number: number;
  instructions: string;
  questions: ListeningQuestion[];
}
interface ListeningTest {
  title: string;
  audio_src: string;
  sections: ListeningSection[];
}
interface GridRow {
  section_number: number;
  question_number: number;
  question_type: string;
  question_text: string;
  options?: string;
  correct_answer?: string;
  transcript?: string;
  audio_url: string;
  timestamp: number;
}

const DEFAULT_LISTENING_PROMPT = `
Given raw IELTS Listening test content, convert it to valid JSON in the following format:

{
  "title": string,
  "audio_src": string,
  "sections": [
    {
      "section_number": integer,
      "instructions": string,
      "questions": [
        {
          "question_number": integer,
          "question_type": "fill-blank" | "mcq" | "matching",
          "question_text": string,
          "options": [string] | null,
          "correct_answer": string | [string],
          "transcript": string | null,
          "audio_url": string,
          "timestamp": integer,
          "section": integer
        }
      ]
    }
  ]
}

- Use the above schema exactly: do not omit any fields or change any names.
- If a value is not available, use null for nullable fields.
- Output only valid JSON, no extra text or markdown.
`.trim();

const csvColumns = [
  { key: 'section_number', name: 'Section', editable: true, width: 80 },
  { key: 'question_number', name: 'Q No.', editable: true, width: 80 },
  { key: 'question_type', name: 'Type', editable: true, width: 110 },
  { key: 'question_text', name: 'Question Text', editable: true, width: 340 },
  { key: 'options', name: 'Options', editable: true, width: 160 },
  { key: 'correct_answer', name: 'Answer', editable: true, width: 120 },
  { key: 'audio_url', name: 'Audio URL', editable: true, width: 120 },
  { key: 'timestamp', name: 'Time', editable: true, width: 90 },
];

const PROMPT_OPTIONS = [
  {
    key: 'DEFAULT',
    label: 'Default Listening Prompt',
    prompt: DEFAULT_LISTENING_PROMPT,
  },
  {
    key: 'TO_JSON',
    label: 'Convert to IELTS Listening JSON',
    prompt: `Convert the following IELTS Listening content into JSON using the schema:\n\n${JSON.stringify(listeningSchemaExample, null, 2)}`,
  },
  {
    key: 'TO_CSV',
    label: 'Convert to IELTS Listening CSV',
    prompt: `Convert the following IELTS Listening content into a CSV matching the following columns: section_number, question_number, question_type, question_text, options, correct_answer, audio_url, timestamp.`,
  },
  {
    key: 'ADDANSWER',
    label: 'Add Answer From AI',
    prompt: `For each question in the following IELTS Listening JSON, infer the correct_answer field if missing, based on the question_text and options.`,
  },
];

export default function ListeningImporterClient() {
  // UI State
  const [text, setText] = useState('');
  const [audioSrc, setAudioSrc] = useState('');
  const [editableJSON, setEditableJSON] = useState('');
  const [csvRows, setCsvRows] = useState<GridRow[]>([]);
  const [aiOutput, setAiOutput] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [customPrompt, setCustomPrompt] = useState(DEFAULT_LISTENING_PROMPT);
  const [showExample, setShowExample] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showCustomPrompt, setShowCustomPrompt] = useState(false);

  // Prompt Modal State
  const [showPromptSelector, setShowPromptSelector] = useState(false);
  const [selectedPromptIdx, setSelectedPromptIdx] = useState(0);

  // PDF Upload/Extract
  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setLoading(true);
    let combinedText = text;
    for (const file of Array.from(e.target.files)) {
      try {
        const arrayBuffer = await file.arrayBuffer();
        // Assumes PDF.js is loaded globally
        const pdf = await (window as any).pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          const pageText = content.items.map((item: any) => ('str' in item ? item.str : '')).join(' ');
          combinedText += '\n\n' + pageText;
        }
      } catch (err) {
        alert('❌ Failed to extract PDF text.');
        console.error(err);
      }
    }
    setText(combinedText.trim());
    setLoading(false);
  };

  // PNG/JPG OCR (Screenshot Uploader)
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    setLoading(true);
    try {
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/ocr-vision', { method: 'POST', body: formData });
      const { text: ocrText } = await res.json();
      setText((t) => t + '\n\n' + ocrText);
    } catch (err) {
      alert('❌ OCR failed.');
      console.error(err);
    }
    setLoading(false);
  };

  // "Help from AI" modal logic
  const handleHelpFromAI = () => {
    setShowPromptSelector(true);
  };

  const handlePromptSubmit = async () => {
    setShowPromptSelector(false);
    setAiOutput('');
    setAiLoading(true);

    const chosenPrompt =
      PROMPT_OPTIONS[selectedPromptIdx]?.prompt ||
      DEFAULT_LISTENING_PROMPT;

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: chosenPrompt, text }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Unknown AI error');

      let output: string = data.output.replace(/^```(?:json)?\s*/, '').replace(/```$/g, '').trim();
      try {
        const parsed = JSON.parse(output);
        output = JSON.stringify(parsed, null, 2);
      } catch { /* leave as raw */ }
      setAiOutput(output);
      setEditableJSON(output);
    } catch (err: any) {
      alert(`AI generation failed:\n${err.message}`);
      console.error('AI error:', err);
    } finally {
      setAiLoading(false);
    }
  };

  // Use audioSrc for both audio_src (global) and as fallback for missing audio_url in questions
  const handleConvertToJSON = () => {
    try {
      const obj: ListeningTest = JSON.parse(aiOutput || editableJSON || text);
      obj.audio_src = audioSrc;
      obj.sections?.forEach(section => {
        section.questions?.forEach(q => {
          if (!q.audio_url || q.audio_url === '') {
            q.audio_url = audioSrc;
          }
        });
      });
      setEditableJSON(JSON.stringify(obj, null, 2));
      alert('✅ JSON ready!');
    } catch {
      alert('❌ Invalid JSON (try Help from AI)');
    }
  };

  // Convert to CSV (from JSON)
  const handleConvertToCSV = () => {
    try {
      const listening: ListeningTest = JSON.parse(editableJSON);
      const rows: GridRow[] = [];
      for (const s of listening.sections) {
        for (const q of s.questions) {
          rows.push({
            section_number: s.section_number,
            question_number: q.question_number,
            question_type: q.question_type,
            question_text: q.question_text,
            options: q.options ? q.options.join(';') : '',
            correct_answer: Array.isArray(q.correct_answer) ? q.correct_answer.join(';') : q.correct_answer || '',
            audio_url: q.audio_url || listening.audio_src,
            timestamp: q.timestamp,
          });
        }
      }
      setCsvRows(rows);
      alert('✅ CSV generated!');
    } catch {
      alert('❌ JSON invalid or not loaded.');
    }
  };

  // Upload JSON to Supabase (normalized, with test_id and section_id on questions)
  const handleUploadJSON = async () => {
    setLoading(true);
    try {
      const listening: ListeningTest = JSON.parse(editableJSON);

      // 1. Insert the listening test and get its ID
      const { data: test, error: testError } = await supabase
        .from('listening_tests')
        .insert({
          title: listening.title,
          audio_src: listening.audio_src,
        })
        .select()
        .single();
      if (testError) throw testError;

      // 2. For each section, insert into listening_sections and get section_id
      for (const section of listening.sections) {
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

        // 3. For each question, insert into listening_questions with test_id, section_id, and question_number
        for (const q of section.questions) {
          // Normalize question_type if needed (e.g. multi-mcq/map → mcq)
          let questionType: string = q.question_type;
          if (questionType === "multi-mcq" || questionType === "map") questionType = "mcq";

          const { error: qError } = await supabase
            .from('listening_questions')
            .insert({
              test_id: test.id,
              section_id: sectionRow.id,
              question_number: q.question_number,
              question_type: questionType,
              question_text: q.question_text,
              options: q.options ?? null,
              correct_answer: q.correct_answer ?? null,
              transcript: q.transcript ?? null,
              audio_url: q.audio_url || listening.audio_src,
              timestamp: q.timestamp,
            });
          if (qError) throw qError;
        }
      }
      alert('✅ Listening test uploaded!');
    } catch (err: any) {
      alert('❌ JSON upload failed: ' + (err.message || err.error_description || 'Unknown error'));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Upload CSV to Supabase
  const handleUploadCSV = async () => {
    setLoading(true);
    try {
      for (const row of csvRows) {
        const { error } = await supabase
          .from('listening_questions')
          .insert({
            section: row.section_number,
            question_text: row.question_text,
            question_type: row.question_type as any,
            options: row.options?.split(';').map(s => s.trim()).filter(Boolean) ?? null,
            correct_answer: row.correct_answer?.includes(';')
              ? row.correct_answer.split(';').map(s => s.trim())
              : row.correct_answer,
            transcript: row.transcript ?? null,
            audio_url: row.audio_url || audioSrc,
            timestamp: row.timestamp,
          });
        if (error) throw error;
      }
      alert('✅ CSV uploaded!');
    } catch (err: any) {
      alert('❌ CSV upload failed: ' + (err.message || err.error_description || 'Unknown error'));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">
        🎧 Listening Importer: PDF/IMG to JSON/CSV to Supabase
      </h2>
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <div className="mb-2 flex gap-2">
            <input type="file" accept="application/pdf" multiple onChange={handlePdfUpload} className="block" />
            <input type="file" accept="image/png,image/jpeg" onChange={handleImageUpload} className="block" />
            <span className="text-xs text-gray-500">PDF or Screenshot (OCR)</span>
          </div>
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            className="w-full h-44 p-2 border rounded"
            placeholder="Paste or extract listening test text here…"
          />
          <input
            value={audioSrc}
            onChange={e => setAudioSrc(e.target.value)}
            className="mt-2 w-full p-2 border rounded"
            placeholder="Enter main audio file URL (audio_src)..."
            required
          />
        </div>
        <div className="flex-1 flex flex-col gap-2">
          <button
            onClick={handleHelpFromAI}
            disabled={aiLoading}
            className="px-4 py-2 bg-indigo-600 text-white rounded disabled:opacity-50"
          >
            {aiLoading ? 'Generating…' : '🤖 Help from AI'}
          </button>
          <button
            onClick={handleConvertToJSON}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Convert to JSON
          </button>
          <button
            onClick={handleConvertToCSV}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Convert to CSV
          </button>
          <button
            onClick={() => setShowExample(v => !v)}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded"
          >
            {showExample ? 'Hide' : 'Show'} Example Schema
          </button>
          <button
            onClick={() => setShowCustomPrompt(v => !v)}
            className="px-4 py-2 bg-yellow-100 text-yellow-900 rounded border border-yellow-400"
          >
            {showCustomPrompt ? 'Hide' : 'Show'} AI Instructions
          </button>
        </div>
      </div>

      {/* Prompt Modal */}
      {showPromptSelector && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h4 className="font-semibold text-lg mb-2">Select AI Prompt</h4>
            <ul className="space-y-2 mb-4">
              {PROMPT_OPTIONS.map((option, idx) => (
                <li key={option.key}>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="prompt"
                      checked={selectedPromptIdx === idx}
                      onChange={() => setSelectedPromptIdx(idx)}
                    />
                    <span>{option.label}</span>
                  </label>
                </li>
              ))}
            </ul>
            <div className="flex gap-2 justify-end">
              <button
                className="px-4 py-2 rounded bg-gray-100"
                onClick={() => setShowPromptSelector(false)}
              >Cancel</button>
              <button
                className="px-4 py-2 rounded bg-blue-600 text-white"
                onClick={handlePromptSubmit}
              >Continue</button>
            </div>
          </div>
        </div>
      )}

      {showExample && (
        <pre className="bg-gray-100 rounded p-2 mb-4 overflow-auto text-xs max-h-72">
          {JSON.stringify(listeningSchemaExample, null, 2)}
        </pre>
      )}

      {showCustomPrompt && (
        <div className="mt-6">
          <h4 className="text-lg font-semibold mb-2">AI Instructions</h4>
          <textarea
            value={customPrompt}
            onChange={e => setCustomPrompt(e.target.value)}
            className="w-full h-28 p-2 border rounded mb-2"
            placeholder="AI instructions for listening test conversion"
          />
        </div>
      )}

      {/* AI Output */}
      {aiOutput && (
        <>
          <h5 className="mt-4 font-medium">AI Output</h5>
          <textarea
            readOnly
            value={aiOutput}
            className="w-full h-60 mt-2 p-2 bg-gray-100 font-mono rounded"
          />
        </>
      )}

      {/* Editable JSON */}
      {editableJSON && (
        <>
          <h4 className="mt-6 text-xl font-semibold">🧾 Editable JSON</h4>
          <textarea
            value={editableJSON}
            onChange={e => setEditableJSON(e.target.value)}
            className="w-full h-60 mt-2 p-2 bg-gray-100 font-mono rounded"
          />
          <div className="mt-2 space-x-2">
            <button
              onClick={handleUploadJSON}
              disabled={loading}
              className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
            >
              {loading ? 'Uploading...' : '📤 Upload JSON'}
            </button>
          </div>
        </>
      )}

      {/* CSV Editor */}
      {csvRows.length > 0 && (
        <>
          <h4 className="mt-6 text-xl font-semibold">📈 CSV Spreadsheet Editor</h4>
          <div className="h-96 mt-2 mb-4">
            <DataGrid
              columns={csvColumns}
              rows={csvRows}
              onRowsChange={setCsvRows}
              className="rdg-light"
            />
          </div>
          <button
            onClick={handleUploadCSV}
            className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600"
          >
            📤 Upload CSV to Supabase
          </button>
        </>
      )}
    </div>
  );
}
