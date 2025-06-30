'use client';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

// Utility to group questions by instruction (just like on test)
function groupByInstruction(questions) {
  const groups = [];
  let currentInst = undefined;
  let block = [];
  questions.forEach((q, i) => {
    if (i === 0 || q.instruction !== currentInst) {
      if (block.length) groups.push({ instruction: currentInst, questions: block });
      currentInst = q.instruction;
      block = [q];
    } else {
      block.push(q);
    }
  });
  if (block.length) groups.push({ instruction: currentInst, questions: block });
  return groups;
}

export default function ReadingResultReview() {
  const router = useRouter();
  const { testId } = router.query;

  const [attempt, setAttempt] = useState<any>(null);
  const [test, setTest] = useState<any>(null);
  const [passages, setPassages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch attempt, test, and passages with full question info
  useEffect(() => {
    if (!testId) return;
    setLoading(true);

    (async () => {
      // 1. Fetch attempt (user answers)
      const { data: attempts } = await supabase
        .from('reading_attempts')
        .select('*')
        .eq('test_id', testId)
        .order('submitted_at', { ascending: false })
        .limit(1);

      setAttempt(attempts?.[0]);

      // 2. Fetch test details, including passages/questions
      const { data: testData } = await supabase
        .from('reading_papers')
        .select(`
          *,
          reading_passages (
            id,
            passage_number,
            title,
            body,
            section_instruction,
            reading_questions (
              id,
              question_number,
              question_type,
              text,
              instruction,
              options,
              answer
            )
          )
        `)
        .eq('id', testId)
        .single();

      setTest(testData);

      setPassages(
        (testData?.reading_passages || [])
          .sort((a, b) => a.passage_number - b.passage_number)
          .map(p => ({
            ...p,
            // Optionally, group questions here by their instruction:
            question_groups: groupByInstruction(
              (p.reading_questions || []).sort((a, b) => a.question_number - b.question_number)
            ),
          }))
      );

      setLoading(false);
    })();
  }, [testId]);

  if (loading) return <div className="p-8 text-lg">Loading result...</div>;
  if (!attempt || !test) return (
    <div className="p-8 text-xl text-red-600">No attempt found for this test.</div>
  );

  // Gather correct answers
  const userAnswers = attempt.answers || {};
  // Build correct answers from passage data (since reading_questions has answer field)
  const correctAnswers: Record<string, string> = {};
  passages.forEach(p =>
    (p.reading_questions || []).forEach((q: any) =>
      correctAnswers[q.id] = typeof q.answer === 'string' ? q.answer : (Array.isArray(q.answer) ? q.answer[0] : '')
    )
  );

  // Build a flat ordered question list for scoring
  const allQuestions = passages.flatMap(p =>
    (p.reading_questions || []).sort((a, b) => a.question_number - b.question_number)
  );
  let total = allQuestions.length, correct = 0;
  allQuestions.forEach(q => {
    if (
      userAnswers[q.id]?.trim()?.toLowerCase() ===
      (typeof q.answer === 'string'
        ? q.answer?.trim()?.toLowerCase()
        : Array.isArray(q.answer)
        ? q.answer[0]?.trim()?.toLowerCase()
        : ''
      )
    ) {
      correct++;
    }
  });

  // Band estimate: real IELTS bands are mapped, here just for demo
  const band = Math.max(1, Math.round((correct / total) * 9 * 10) / 10);

  return (
    <div className="min-h-screen bg-blue-50 py-10 px-3 flex flex-col items-center">
      <div className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl p-8 border">
        <div className="mb-5 flex flex-col items-center">
          <h1 className="text-3xl font-extrabold text-blue-900 mb-2 text-center">
            IELTS Reading Test Review
          </h1>
          {test?.title && (
            <h2 className="text-xl text-blue-700 font-bold mb-4 text-center">{test.title}</h2>
          )}
          <div className="mb-3 flex flex-col items-center">
            <div className="text-lg font-semibold mb-2">
              Score: <span className="text-blue-900">{correct} / {total}</span>
            </div>
            <span className="inline-block px-7 py-2 text-xl font-bold rounded-2xl shadow bg-gradient-to-r from-blue-600 to-green-500 text-white mb-2">
              Band (est.): {band}
            </span>
          </div>
        </div>
        <hr className="my-6" />

        {/* Review by passage */}
        <div className="space-y-14">
          {passages.map(passage => (
            <div key={passage.id}>
              <div className="mb-5">
                <span className="text-base font-bold text-blue-700">
                  Passage {passage.passage_number}:
                </span>
                <span className="ml-2 text-lg font-semibold text-gray-700">
                  {passage.title}
                </span>
              </div>
              {/* Section instruction (optional) */}
              {passage.section_instruction && (
                <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6 text-blue-900 rounded-xl text-base font-medium shadow">
                  {passage.section_instruction}
                </div>
              )}

              {/* Instruction blocks */}
              <div className="space-y-8">
                {(passage.question_groups || []).map((block, blockIdx) => {
                  const qFirst = block.questions[0]?.question_number;
                  const qLast = block.questions[block.questions.length - 1]?.question_number;
                  return (
                    <div key={blockIdx}>
                      {block.instruction && (
                        <div className="flex items-center gap-4 mb-4">
                          <span className="inline-block bg-yellow-300/80 text-yellow-900 font-bold rounded-xl px-5 py-1.5 text-lg shadow-sm tracking-tight border-2 border-yellow-400">
                            {qFirst === qLast
                              ? `Q${qFirst}`
                              : `Questions ${qFirst}–${qLast}`}
                          </span>
                          <span className="flex-1 bg-yellow-50 border border-yellow-200 rounded-2xl p-5 shadow-sm text-base font-semibold leading-relaxed">
                            {block.instruction}
                          </span>
                        </div>
                      )}
                      <ol className="space-y-4">
                        {block.questions.map((q: any) => {
                          const userAns = userAnswers[q.id];
                          const isCorrect = userAns?.trim()?.toLowerCase() ===
                            (typeof q.answer === 'string'
                              ? q.answer?.trim()?.toLowerCase()
                              : Array.isArray(q.answer)
                                ? q.answer[0]?.trim()?.toLowerCase()
                                : ''
                            );
                          return (
                            <li key={q.id} className="p-0">
                              <div
                                className={`flex flex-col md:flex-row items-start md:items-center px-7 py-6 rounded-2xl shadow border
                                  ${isCorrect === true ? 'bg-green-50 border-green-300'
                                    : isCorrect === false && userAns
                                      ? 'bg-red-50 border-red-300'
                                      : 'bg-gray-50 border-gray-200'}`}
                              >
                                <span className="w-11 h-11 mr-4 rounded-full flex items-center justify-center text-xl font-extrabold
                                  border-2 shadow-sm mb-2 md:mb-0"
                                  style={{
                                    background: isCorrect === true
                                      ? '#bbf7d0'
                                      : isCorrect === false && userAns
                                        ? '#fee2e2'
                                        : '#e0e7ef',
                                    borderColor: isCorrect === true
                                      ? '#22c55e'
                                      : isCorrect === false && userAns
                                        ? '#ef4444'
                                        : '#cbd5e1',
                                    color: isCorrect === true
                                      ? '#166534'
                                      : isCorrect === false && userAns
                                        ? '#b91c1c'
                                        : '#334155'
                                  }}
                                >
                                  Q{q.question_number}
                                </span>
                                <div className="flex-1 ml-0 md:ml-6">
                                  <div className="font-semibold text-gray-900 text-base mb-2 leading-relaxed">{q.text}</div>
                                  <div className="flex items-center gap-4 mt-1 mb-1">
                                    <span className={`px-3 py-1 rounded-lg font-semibold text-base shadow
                                      ${isCorrect === true
                                        ? 'bg-green-200 text-green-900 border border-green-400'
                                        : isCorrect === false && userAns
                                          ? 'bg-red-200 text-red-900 border border-red-400'
                                          : 'bg-gray-200 text-gray-600 border border-gray-400'
                                      }`}>
                                      Your answer: {userAns || <span className="text-gray-400 italic">No answer</span>}
                                    </span>
                                    {isCorrect === false && (
                                      <span className="ml-2 text-base text-blue-800 bg-blue-100 px-3 py-1 rounded shadow">
                                        Correct: <span className="font-mono font-bold">{typeof q.answer === 'string' ? q.answer : Array.isArray(q.answer) ? q.answer[0] : ''}</span>
                                      </span>
                                    )}
                                    {isCorrect === true && (
                                      <span className="ml-2 text-green-700 font-bold">✔ Correct</span>
                                    )}
                                  </div>
                                  {/* (Optional) Show explanation */}
                                  {/* {q.explanation && (
                                    <div className="mt-2 text-sm text-gray-500 italic">
                                      <b>Explanation:</b> {q.explanation}
                                    </div>
                                  )} */}
                                </div>
                              </div>
                            </li>
                          );
                        })}
                      </ol>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Next Steps */}
        <div className="mt-14 flex flex-col gap-3 items-center">
          <button
            className="bg-blue-700 hover:bg-blue-900 text-white px-7 py-3 rounded-2xl shadow text-lg font-semibold"
            onClick={() => router.push('/practice/reading/history')}
          >
            📚 Go to My Reading History
          </button>
          <button
            className="bg-green-600 hover:bg-green-800 text-white px-7 py-3 rounded-2xl shadow text-lg font-semibold"
            onClick={() => router.push('/dashboard')}
          >
            🏠 Back to Dashboard
          </button>
          <button
            className="bg-indigo-700 hover:bg-indigo-900 text-white px-7 py-3 rounded-2xl shadow text-lg font-semibold"
            onClick={() => router.push('/practice/reading')}
          >
            ➕ Try Another Reading Test
          </button>
        </div>
      </div>
    </div>
  );
}
