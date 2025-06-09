// src/pages/practice/writing.tsx
import { useEffect, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { supabase } from '@/lib/supabaseClient';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import { writingPrompts } from '@/lib/writingPrompts';

export default function WritingPractice() {
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedPrompt, setSelectedPrompt] = useState(writingPrompts[0]);
  const [wordCount, setWordCount] = useState(0);
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [timerStarted, setTimerStarted] = useState(false);

  const editor = useEditor({
    extensions: [StarterKit],
    content: '',
    onUpdate: ({ editor }) => {
      const text = editor.getText().trim();
      setWordCount(text ? text.split(/\s+/).length : 0);
      if (!timerStarted) setTimerStarted(true);
    },
  });

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timerStarted) {
      interval = setInterval(() => {
        setSecondsElapsed((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerStarted]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const handlePromptChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const prompt = writingPrompts.find((p) => p.id === e.target.value);
    if (prompt) {
      setSelectedPrompt(prompt);
      editor?.commands.clearContent();
      setWordCount(0);
      setSecondsElapsed(0);
      setTimerStarted(false);
      setFeedback('');
    }
  };

  const handleSubmit = async () => {
    if (!editor) return;

    const text = editor.getText();
    const { data: { user }, error } = await supabase.auth.getUser();
    if (!user || error) {
      toast.error('You must be logged in.');
      return;
    }

    setLoading(true);
    setFeedback('');

    try {
      const res = await fetch('/api/evaluate-writing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          userId: user.id,
          promptId: selectedPrompt.id,
          durationSeconds: secondsElapsed,
          wordCount,
        }),
      });

      const data = await res.json();
      if (res.status === 200) {
        toast.success('AI Feedback received!');
        setFeedback(data.feedback);
      } else {
        toast.error('Unexpected error occurred.');
        console.error('Server error:', data);
      }
    } catch (err) {
      toast.error('Network or API failure.');
      console.error('Fetch error:', err);
    }

    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">IELTS Writing Practice</h1>

      {/* Overview of IELTS Writing */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Overview</h2>
        <p className="text-gray-700 mb-1">
          The IELTS Writing test consists of two tasks:
        </p>
        <ul className="list-disc list-inside text-gray-700">
          <li><strong>Task 1:</strong> Describe visual information (chart, graph, map) in at least 150 words (approx. 20 minutes).</li>
          <li><strong>Task 2:</strong> Write an essay of at least 250 words on a given topic (approx. 40 minutes).</li>
        </ul>
      </section>

      {/* Sample Question Selector */}
      <section className="mb-6">
        <label htmlFor="promptSelect" className="block font-medium mb-1">Select a Sample Question:</label>
        <select
          id="promptSelect"
          value={selectedPrompt.id}
          onChange={handlePromptChange}
          className="border rounded p-2 w-full"
        >
          {writingPrompts.map((p) => (
            <option key={p.id} value={p.id}>{p.task}</option>
          ))}
        </select>
      </section>

      <p className="mb-4 text-sm text-gray-600">
        <strong>Task:</strong> {selectedPrompt.task}
      </p>

      <div className="flex justify-between text-xs text-gray-500 mb-2">
        <span>⏱ Time: {formatTime(secondsElapsed)}</span>
        <span>📝 Word Count: {wordCount}</span>
      </div>

      <div className="border rounded p-4 min-h-[200px] bg-white mb-4">
        <EditorContent editor={editor} />
      </div>

      <button
        onClick={handleSubmit}
        className="bg-blue-600 text-white px-4 py-2 rounded"
        disabled={loading}
      >
        {loading ? 'Evaluating...' : 'Evaluate with AI'}
      </button>

      {feedback && (
        <div className="mt-6 p-4 border border-gray-300 rounded bg-gray-50">
          <h2 className="font-semibold text-lg mb-2">AI Feedback</h2>
          <p className="whitespace-pre-line">{feedback}</p>
        </div>
      )}

      <Link
        href="/practice/history"
        className="text-blue-600 hover:underline mt-6 inline-block"
      >
        📜 View My Writing History
      </Link>
    </div>
  );
}
