'use client';

import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { supabase } from '@/lib/supabaseClient';
import FocusedLayout from '@/layouts/FocusedLayout';

type AnswerMap = Record<string, string>;

type ListeningTest = {
  id: string;
  title: string;
  audioUrl: string;
  sections: {
    section: number;
    instructions: string;
    questions: {
      questionNumber: number;
      questionText: string;
      type: string;
      options?: string[];
      correctAnswer: string | string[];
    }[];
  }[];
};

export default function ListeningTestPage() {
  const router = useRouter();
  const { testId } = router.query;

  const [test, setTest] = useState<ListeningTest | null>(null);
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (typeof testId === 'string') {
      import(`@/data/listening-tests/${testId}.json`)
        .then((mod) => setTest(mod.default))
        .catch(() => toast.error('Test not found'));
    }
  }, [testId]);

  const handleChange = (id: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async () => {
    if (!test) return;
    setLoading(true);

    try {
      let correct = 0;
      const sectionScores: Record<number, { correct: number; total: number }> = {};
      const typeScores: Record<string, { correct: number; total: number }> = {};
      const analytics = [];

      for (const section of test.sections) {
        sectionScores[section.section] = { correct: 0, total: section.questions.length };

        for (const q of section.questions) {
          const userAns = answers[`q${q.questionNumber}`] || '';
          const correctAns = Array.isArray(q.correctAnswer)
            ? q.correctAnswer.map((a) => a.toLowerCase().trim())
            : [q.correctAnswer.toLowerCase().trim()];
          const isCorrect = correctAns.includes(userAns.toLowerCase().trim());

          if (!typeScores[q.type]) {
            typeScores[q.type] = { correct: 0, total: 0 };
          }

          typeScores[q.type].total++;
          if (isCorrect) {
            correct++;
            sectionScores[section.section].correct++;
            typeScores[q.type].correct++;
          }

          analytics.push({
            qId: q.questionNumber,
            section: section.section,
            type: q.type,
            userAnswer: userAns,
            correctAnswer: correctAns,
            isCorrect,
          });
        }
      }

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        await supabase.from('listening_attempts').insert([
          {
            user_id: user.id,
            test_id: test.id,
            score: correct,
            answers,
            analytics,
            attempted_on: new Date().toISOString(),
          },
        ]);
      }

      localStorage.setItem(
        'listeningResults',
        JSON.stringify({
          testId: test.id,
          results: {
            score: correct,
            sectionScores,
            typeScores,
          },
          answers,
          questions: test.sections.flatMap((s) =>
            s.questions.map((q) => ({
              id: `q${q.questionNumber}`,
              questionText: q.questionText,
              correctAnswer: q.correctAnswer,
            }))
          ),
        })
      );

      toast.success(`Submitted! Redirecting to results...`);
      router.push('/practice/listening/results');
    } catch (err) {
      console.error(err);
      toast.error('Submission failed');
    } finally {
      setLoading(false);
    }
  };

  if (!test) return <div className="p-8 text-center">Loading test...</div>;

  const section = test.sections[currentSectionIndex];

  return (
    <FocusedLayout>
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg space-y-6 text-black">
        <h1 className="text-3xl font-bold text-center text-blue-700">{test.title}</h1>

        <audio controls src={test.audioUrl} className="mx-auto w-full max-w-lg" />

        <div>
          <h2 className="text-xl font-semibold text-indigo-700 mt-6">Section {section.section}</h2>
          <p className="italic text-sm text-gray-600 mb-4">{section.instructions}</p>

          <div className="space-y-4">
            {section.questions.map((q) => (
              <div
                key={q.questionNumber}
                className="bg-gray-50 p-4 rounded border border-gray-200"
              >
                <p className="font-medium mb-2">
                  {q.questionNumber}. {q.questionText}
                </p>

                {q.type === 'mcq' &&
                  q.options?.map((opt, idx) => (
                    <label key={idx} className="block">
                      <input
                        type="radio"
                        name={`q${q.questionNumber}`}
                        value={opt}
                        checked={answers[`q${q.questionNumber}`] === opt}
                        onChange={(e) =>
                          handleChange(`q${q.questionNumber}`, e.target.value)
                        }
                        className="mr-2"
                      />
                      {String.fromCharCode(65 + idx)}. {opt}
                    </label>
                  ))}

                {q.type === 'matching' && (
                  <select
                    className="w-full p-2 border rounded"
                    onChange={(e) => handleChange(`q${q.questionNumber}`, e.target.value)}
                    value={answers[`q${q.questionNumber}`] || ''}
                  >
                    <option value="">Select...</option>
                    {q.options?.map((opt, idx) => (
                      <option key={idx} value={String.fromCharCode(65 + idx)}>
                        {String.fromCharCode(65 + idx)}. {opt}
                      </option>
                    ))}
                  </select>
                )}

                {q.type === 'fill-blank' && (
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded"
                    value={answers[`q${q.questionNumber}`] || ''}
                    onChange={(e) => handleChange(`q${q.questionNumber}`, e.target.value)}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-between mt-8">
          <button
            onClick={() => setCurrentSectionIndex((prev) => Math.max(prev - 1, 0))}
            disabled={currentSectionIndex === 0}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 disabled:opacity-50"
          >
            Previous
          </button>
          {currentSectionIndex < test.sections.length - 1 ? (
            <button
              onClick={() =>
                setCurrentSectionIndex((prev) => Math.min(prev + 1, test.sections.length - 1))
              }
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Next Section
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              {loading ? 'Submitting...' : 'Submit Test'}
            </button>
          )}
        </div>
      </div>
    </FocusedLayout>
  );
}
