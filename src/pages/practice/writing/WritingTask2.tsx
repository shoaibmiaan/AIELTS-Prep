'use client';

import { useEffect, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { supabase } from '@/lib/supabaseClient';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import { writingPrompts } from '@/lib/writingPrompts';

const task2Prompts = writingPrompts.filter(p => p.type === 'task2');

export default function WritingTask2() {
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedPrompt, setSelectedPrompt] = useState(() => task2Prompts[0] || null);
  const [wordCount, setWordCount] = useState(0);
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [timerStarted, setTimerStarted] = useState(false);

  const [bandScores, setBandScores] = useState<{
    taskResponse: number;
    coherence: number;
    lexicalResource: number;
    grammaticalRange: number;
    overall: number;
  } | null>(null);

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
    const randomPrompt = task2Prompts[Math.floor(Math.random() * task2Prompts.length)];
    setSelectedPrompt(randomPrompt);
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timerStarted) {
      interval = setInterval(() => {
        setSecondsElapsed(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerStarted]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const handleSubmit = async () => {
    if (!editor || !selectedPrompt) return;

    setTimerStarted(false);
    const text = editor.getText();

    const { data: { user }, error } = await supabase.auth.getUser();
    if (!user || error) {
      toast.error('You must be logged in.');
      return;
    }

    setLoading(true);
    setFeedback('');
    setBandScores(null);

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
        setBandScores(data.bandScores || null);

        const { error: insertError } = await supabase.from('writing_submissions').insert([
          {
            user_id: user.id,
            prompt_id: selectedPrompt.id,
            text,
            feedback: data.feedback,
            word_count: wordCount,
            duration_seconds: secondsElapsed,
            band_scores: data.bandScores || null,
            task_type: 'task2',
          },
        ]);

        if (insertError) {
          console.error('Error saving submission:', insertError);
          toast.error('Failed to save to database.');
        } else {
          toast.success('Saved to your writing history!');
        }
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

  const handleGetNewPrompt = () => {
    const newPrompt = task2Prompts[Math.floor(Math.random() * task2Prompts.length)];
    setSelectedPrompt(newPrompt);
    editor?.commands.clearContent();
    setWordCount(0);
    setSecondsElapsed(0);
    setTimerStarted(true);
    setFeedback('');
    setBandScores(null);
  };

  if (!selectedPrompt) {
    return (
      <div className="max-w-2xl mx-auto mt-10 text-center">
        <p className="text-red-600">❌ No Task 2 prompts found. Please add some prompts first.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">IELTS Writing Task 2</h1>

      <section className="mb-6">
        <p className="text-gray-700 mb-1">
          Write an essay in response to a point of view, argument, or problem. Minimum 250 words.
        </p>
      </section>

      <p className="mb-2 text-sm text-gray-600">
        <strong>Prompt:</strong> {selectedPrompt.task}
        <button
          onClick={handleGetNewPrompt}
          className="ml-3 text-blue-500 text-xs hover:underline"
        >
          🔄 Get a Different Prompt
        </button>
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
        <>
          <div className="mt-6 p-4 border border-gray-300 rounded bg-gray-50">
            <h2 className="font-semibold text-lg mb-2">AI Feedback</h2>
            <p className="whitespace-pre-line">{feedback}</p>
          </div>

          {bandScores && (
            <div className="mt-6">
              <h2 className="font-semibold text-sm text-gray-700 mb-2">📊 Band Score Evaluation</h2>
              {Object.entries(bandScores).map(([key, value]) => {
                if (key === 'overall') return null;
                return (
                  <div key={key} className="mb-2">
                    <label className="text-xs capitalize text-gray-600 block mb-1">
                      {key.replace(/([A-Z])/g, ' $1')}
                    </label>
                    <div className="text-sm text-gray-800 font-semibold">Score: {value}</div>
                  </div>
                );
              })}
              <div className="text-sm text-gray-700 mt-2">
                🏁 <strong>Overall Band:</strong>{' '}
                {bandScores.overall ? bandScores.overall.toFixed(1) : 'N/A'}
              </div>
            </div>
          )}
        </>
      )}

      <Link
        href="/practice/writing/writing-history2"
        className="text-blue-600 hover:underline mt-6 inline-block"
      >
        📜 View My Writing History
      </Link>
    </div>
  );
}
