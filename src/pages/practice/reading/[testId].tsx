// src/pages/practice/reading/[testId].tsx
'use client';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import FocusedLayout from '@/layouts/FocusedLayout';
import ReadingPassagePane from '@/components/reading/ReadingPassagePane';
import ReadingQuestionPane from '@/components/reading/ReadingQuestionPane';
import QuestionNavigator from '@/components/reading/QuestionNavigator';
import ReadingTimer from '@/components/reading/ReadingTimer';
import ReviewPanel from '@/components/reading/ReviewPanel';

export default function ReadingTestPage() {
  const router = useRouter();
  const { testId } = router.query;

  const [test, setTest] = useState<any>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [flags, setFlags] = useState<Record<string, boolean>>({});
  const [timeLeft, setTimeLeft] = useState(60 * 60);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Fetch the test from Supabase
  useEffect(() => {
    if (!testId) return;
    setLoading(true);
    supabase
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
            options,
            answer,
            instruction
          )
        )
      `)
      .eq('id', testId)
      .single()
      .then(({ data }) => {
        setTest(data);
        setLoading(false);
      });
  }, [testId]);

  // Timer logic and auto-submit
  useEffect(() => {
    if (timeLeft <= 0) {
      setShowReview(true);
      return;
    }
    const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleAnswer = (qnId: string, value: string) => {
    setAnswers(a => ({ ...a, [qnId]: value }));
  };

  const handleFlag = (qnId: string) => {
    setFlags(f => ({ ...f, [qnId]: !f[qnId] }));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setSubmitError(null);
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      setSubmitError('You must be signed in to submit.');
      setSubmitting(false);
      return;
    }
    const { error } = await supabase.from('reading_attempts').insert({
      user_id: user.id,
      test_id: testId,
      answers,
      flags,
      raw_score: null,
      band_score: null,
      submitted_at: new Date().toISOString(),
    });
    setSubmitting(false);
    if (error) {
      setSubmitError(error.message || 'Failed to submit. Please try again.');
      return;
    }
    router.replace('/practice/reading/result?testId=' + testId);
  };

  // Group-less mapping (inject dummy group per passage)
  const mappedPassages = test?.reading_passages?.map((p: any) => ({
    ...p,
    question_groups: [{
      group_number: 1,
      instruction: null,
      questions: (p.reading_questions || []).map((q: any) => ({
        ...q,
        id: q.id,
        question_number: q.question_number,
        question_type: q.question_type,
        text: q.text,
        options: q.options,
        explanation: q.explanation,
      }))
    }]
  })) || [];

  const allQuestions = mappedPassages.flatMap((p: any) =>
  p.question_groups.flatMap((g: any) => g.questions)
).sort((a, b) => (a.question_number ?? 0) - (b.question_number ?? 0));

  const handleJump = (qnId: string) => {
    document.getElementById(`question-${qnId}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  if (loading || !test) return <div className="p-8 text-lg">Loading...</div>;

  return (
    <FocusedLayout>
      <div className="w-full fixed top-0 left-0 z-40 bg-white border-b shadow-sm flex items-center justify-center py-3">
        <ReadingTimer timeLeft={timeLeft} />
      </div>

      <div className="flex flex-col md:flex-row max-w-7xl w-full mx-auto pt-20 pb-6 min-h-[80vh]">
        <div className="md:w-1/2 w-full h-96 md:h-[76vh] overflow-y-auto border-r p-6 bg-white">
          <ReadingPassagePane passages={test.reading_passages} />
        </div>
        <div className="md:w-1/2 w-full h-[76vh] flex flex-col relative p-6">
          <div className="sticky top-0 z-30 bg-white pb-2">
            <QuestionNavigator
              questions={allQuestions}
              answers={answers}
              flags={flags}
              onJump={handleJump}
            />
          </div>
          <div className="flex-1 overflow-y-auto pt-2 pb-4">
            <ReadingQuestionPane
              passages={mappedPassages}
              answers={answers}
              flags={flags}
              onAnswerChange={handleAnswer}
              onFlag={handleFlag}
            />
          </div>
          <div className="sticky bottom-0 z-20 bg-white pt-3 pb-3 flex justify-end">
            <button
              onClick={() => setShowReview(true)}
              disabled={submitting}
              className="bg-blue-700 hover:bg-blue-900 text-white font-bold px-8 py-2 rounded-2xl shadow-xl text-lg transition"
            >
              {submitting ? 'Submitting...' : 'Review & Submit'}
            </button>
          </div>
        </div>
      </div>

      {submitError && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-red-100 text-red-800 border border-red-300 px-6 py-3 rounded-2xl shadow-lg z-50 font-bold text-lg">
          {submitError}
        </div>
      )}
      {submitting && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-blue-100 text-blue-800 border border-blue-300 px-6 py-3 rounded-2xl shadow-lg z-50 font-bold text-lg">
          Submitting...
        </div>
      )}

      {showReview && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-8 shadow-2xl w-full max-w-lg border">
            <ReviewPanel
              questions={allQuestions}
              answers={answers}
              flags={flags}
              onJump={qnId => {
                setShowReview(false);
                setTimeout(() => handleJump(qnId), 100);
              }}
              onSubmit={handleSubmit}
            />
            <button
              className="mt-4 text-blue-600 underline"
              onClick={() => setShowReview(false)}
              disabled={submitting}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </FocusedLayout>
  );
}
