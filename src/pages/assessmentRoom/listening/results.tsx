'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Header from '@/components/listening/Header';
import { supabase } from '@/lib/supabaseClient';

type Question = {
  id: string;
  questionText: string;
  correctAnswer: string | string[];
};

export default function ListeningResults() {
  const router = useRouter();
  const [data, setData] = useState<{
    testId: string;
    results: {
      score: number;
      sectionScores: Record<number, { correct: number; total: number }>;
      typeScores: Record<string, { correct: number; total: number }>;
    };
    answers: Record<string, string>;
    questions: Question[];
  } | null>(null);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('listeningResults');
      if (!stored) {
        setError('No result data found. Please complete a test first.');
        return;
      }

      const parsed = JSON.parse(stored);

      // Defensive checks
      if (
        !parsed.testId ||
        !parsed.questions ||
        !parsed.answers ||
        !parsed.results
      ) {
        setError('Incomplete result data. Please retake the test.');
        return;
      }

      setData(parsed);

      const saveResultView = async () => {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
          console.warn('User not authenticated.');
          return;
        }

        const { results, answers, questions, testId } = parsed;

        const total = Object.values(results.sectionScores).reduce(
          (a, b) => a + b.total,
          0
        );
        const bandScore = Math.round((results.score / total) * 9 * 2) / 2;

        const { data: recentAttempt, error: attemptErr } = await supabase
          .from('listening_attempts')
          .select('id')
          .eq('user_id', user.id)
          .eq('test_id', testId)
          .order('attempted_on', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (attemptErr) {
          console.warn('Failed to fetch attempt:', attemptErr.message);
          return;
        }

        if (recentAttempt?.id) {
          await supabase
            .from('listening_attempts')
            .update({
              result_view: {
                answers,
                sectionScores: results.sectionScores,
                typeScores: results.typeScores,
                bandScore,
                questions,
              },
            })
            .eq('id', recentAttempt.id);
        }
      };

      saveResultView();
    } catch (e) {
      console.error('Error loading results:', e);
      setError('Something went wrong while loading your results.');
    }
  }, [router]);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center text-center p-6">
        <Header />
        <h1 className="text-2xl font-bold text-red-600 mb-4">⚠️ {error}</h1>
        <button
          onClick={() => router.push('/assessmentRoom/listening')}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Go Back to Listening Practice
        </button>
      </div>
    );
  }

  if (!data) return null;

  const { results, answers, questions } = data;
  const { score, sectionScores, typeScores } = results;
  const totalQuestions = Object.values(sectionScores).reduce((sum, s) => sum + s.total, 0);
  const toBand = (c: number, t: number) => Math.round((c / t) * 9 * 2) / 2;
  const overallBand = toBand(score, totalQuestions);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto p-6 space-y-8">
        {/* Overall band */}
        <div className="text-center">
          <h1 className="text-6xl font-extrabold text-indigo-600">{overallBand} Band</h1>
        </div>

        {/* Section scores */}
        <div className="grid grid-cols-2 gap-4">
          {Object.entries(sectionScores).map(([sec, vals]) => (
            <div
              key={sec}
              className="bg-white rounded-2xl p-6 text-center shadow"
            >
              <div className="text-sm text-gray-500">Section {sec}</div>
              <div className="text-3xl font-bold text-green-600">
                {toBand(vals.correct, vals.total)}
              </div>
            </div>
          ))}
        </div>

        {/* Type summary */}
        <div className="bg-white rounded-xl p-6 shadow">
          <h2 className="text-xl font-semibold mb-4">By Question Type</h2>
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(typeScores).map(([type, vals]) => (
              <div key={type} className="flex justify-between">
                <span className="capitalize">{type.replace(/-/g, ' ')}</span>
                <span>{vals.correct}/{vals.total}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Detailed answers */}
        <div className="bg-white rounded-xl p-6 shadow max-h-[60vh] overflow-y-auto">
          <h2 className="text-xl font-semibold mb-4">All Question Details</h2>
          <div className="space-y-4">
            {questions.map((q, idx) => {
              const raw = answers[q.id] || '';
              const userAns = raw.trim();
              const correctAnsList = Array.isArray(q.correctAnswer)
                ? q.correctAnswer.map((a) => a.toLowerCase())
                : [q.correctAnswer.toLowerCase()];
              const isCorrect = correctAnsList.includes(userAns.toLowerCase());
              const correctAnsText = Array.isArray(q.correctAnswer)
                ? q.correctAnswer.join(', ')
                : q.correctAnswer;

              return (
                <div key={q.id} className="p-3 border-b last:border-0">
                  <p className="font-medium">{idx + 1}. {q.questionText}</p>
                  <p className={`mt-1 ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                    Your answer: {userAns || '<no answer>'}
                    {!isCorrect && <span> (Correct: {correctAnsText})</span>}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-between mt-6">
          <button
            onClick={() => {
              localStorage.removeItem('listeningResults');
              router.push('/assessmentRoom/listening');
            }}
            className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Attempt More Test
          </button>
          <button
            onClick={() => router.push('/dashboard')}
            className="px-6 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
          >
            Close
          </button>
        </div>
      </main>
    </div>
  );
}
