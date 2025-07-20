'use client';

import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import ResultReviewPanel from '@/components/reading/ResultReviewPanel';

interface Question {
  id: string;
  question_number: number;
  question_type: string;
  text: string;
  instruction: string;
  options: string[] | null;
  answer: string | string[];
}

interface Passage {
  id: string;
  passage_number: number;
  title: string;
  body: string;
  section_instruction: string;
  reading_questions: Question[];
}

interface Test {
  id: string;
  title: string;
  created_at: string;
  reading_passages: Passage[];
}

interface Attempt {
  id: string;
  test_id: string;
  user_id: string;
  answers: Record<string, string>;
  submitted_at: string;
}

interface QuestionGroup {
  instruction: string;
  questions: Question[];
}

interface PassageWithGroups extends Passage {
  question_groups: QuestionGroup[];
}

function groupByInstruction(questions: Question[]): QuestionGroup[] {
  if (!questions.length) return [];

  const safeQuestions = questions.map(q => ({
    ...q,
    instruction: q.instruction || 'General Questions'
  }));

  const groups: QuestionGroup[] = [];
  let currentInst = safeQuestions[0].instruction;
  let block: Question[] = [safeQuestions[0]];

  for (let i = 1; i < safeQuestions.length; i++) {
    const q = safeQuestions[i];
    if (q.instruction === currentInst) {
      block.push(q);
    } else {
      groups.push({ instruction: currentInst, questions: block });
      currentInst = q.instruction;
      block = [q];
    }
  }

  if (block.length) {
    groups.push({ instruction: currentInst, questions: block });
  }

  return groups;
}

export default function ReadingResultReview() {
  const router = useRouter();
  const { testId } = router.query;

  const [attempt, setAttempt] = useState<Attempt | null>(null);
  const [test, setTest] = useState<Test | null>(null);
  const [passages, setPassages] = useState<PassageWithGroups[]>([]);
  const [loading, setLoading] = useState(true);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!testId) return;
    setLoading(true);
    setError(null);

    const fetchData = async () => {
      try {
        const { data: attempts, error: attemptsError } = await supabase
          .from('reading_attempts')
          .select('*')
          .eq('test_id', testId)
          .order('submitted_at', { ascending: false })
          .limit(1);

        if (attemptsError) throw attemptsError;
        if (!attempts || !attempts.length) {
          throw new Error("No attempt found for this test");
        }
        setAttempt(attempts[0] as Attempt);

        const { data: testData, error: testError } = await supabase
          .from('reading_papers')
          .select(`
            id, title, created_at,
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

        if (testError) throw testError;
        if (!testData) throw new Error("Test not found");

        const passagesData = testData.reading_passages as Passage[] || [];
        const sortedPassages = passagesData
          .sort((a, b) => a.passage_number - b.passage_number)
          .map(p => ({
            ...p,
            reading_questions: (p.reading_questions || [])
              .sort((a, b) => a.question_number - b.question_number)
          }));

        const passagesWithGroups = sortedPassages.map(p => ({
          ...p,
          question_groups: groupByInstruction(p.reading_questions || [])
        })) as PassageWithGroups[];

        setTest(testData as Test);
        setPassages(passagesWithGroups);

      } catch (error: any) {
        console.error("Error fetching data:", error);
        setError(error.message || "Failed to load data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [testId]);

  useEffect(() => {
    if (!attempt || !passages.length) return;

    const allQuestions = passages.flatMap(p => p.reading_questions || []);
    let correct = 0;

    allQuestions.forEach(q => {
      // Ensure that answers are strings and handle null or undefined values
      const userAnswer = (attempt.answers?.[q.id] || '').trim().toLowerCase();
      const correctAnswer = Array.isArray(q.answer)
        ? (q.answer[0] || '').trim().toLowerCase()
        : (q.answer || '').trim().toLowerCase();

      if (userAnswer === correctAnswer) {
        correct++;
      }
    });

    setScore({
      correct,
      total: allQuestions.length
    });
  }, [attempt, passages]);

  if (loading) {
    return <div className="p-8 text-lg">Loading results...</div>;
  }

  if (error) {
    return (
      <div className="p-8 text-xl text-red-600">
        {error}
      </div>
    );
  }

  if (!test || !attempt) {
    return (
      <div className="p-8 text-xl text-red-600">
        No attempt found for this test.
      </div>
    );
  }

  const allQuestions = passages.flatMap(p => p.reading_questions || []);
  const unansweredQuestions = allQuestions.filter(
    q => {
      const userAnswer = attempt.answers?.[q.id] || '';
      return !(userAnswer?.trim());
    }
  );

  const band = Math.max(1, Math.min(9, (score.correct / score.total) * 9));

  return (
    <div className="min-h-screen bg-blue-50 py-10 px-3 flex flex-col items-center">
      <div className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl p-8 border">
        <div className="mb-5 flex flex-col items-center">
          <h1 className="text-3xl font-extrabold text-blue-900 mb-2 text-center">
            IELTS Reading Test Review
          </h1>
          <h2 className="text-xl text-blue-700 font-bold mb-4 text-center">
            {test.title}
          </h2>
          <div className="mb-3 flex flex-col items-center">
            <div className="text-lg font-semibold mb-2">
              Score: <span className="text-blue-900">{score.correct} / {score.total}</span>
            </div>
            <span className="inline-block px-7 py-2 text-xl font-bold rounded-2xl shadow bg-gradient-to-r from-blue-600 to-green-500 text-white mb-2">
              Band (est.): {band.toFixed(1)}
            </span>
          </div>
        </div>
        <hr className="my-6" />

        <div className="space-y-14">
          {/* Removed Passage Body */}
          {/* Focus now only on unanswered questions */}
          <ResultReviewPanel
            unanswered={unansweredQuestions}
            questions={allQuestions}
            onJump={(qnId: string) => {
              const element = document.getElementById(`question-${qnId}`);
              if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}
