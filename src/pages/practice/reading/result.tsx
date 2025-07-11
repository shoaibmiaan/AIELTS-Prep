'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import ResultReviewPanel from '@/components/reading/ResultReviewPanel';
import { motion } from 'framer-motion';
import { Download, AlertCircle } from 'lucide-react';

interface Question {
  id: string;
  question_number: number;
  question_type: string;
  text: string;
  instruction: string | null;
  options: string[] | null;
  answer: string | string[];
}

interface Passage {
  id: string;
  passage_number: number;
  title: string | null;
  body: string;
  section_instruction: string | null;
  reading_questions: Question[];
}

interface Test {
  id: string;
  title: string;
  reading_passages: Passage[];
}

interface Attempt {
  id: number;
  test_id: string;
  user_id: string;
  answers: Record<string, string>;
  submitted_at: string;
}

interface QuestionGroup {
  instruction: string;
  questions: Question[];
}

interface PassageWithGroups extends Omit<Passage, 'reading_questions'> {
  question_groups: QuestionGroup[];
}

export default function ReadingResultReview() {
  const router = useRouter();
  const { testId } = router.query as { testId?: string };
  const [attempt, setAttempt] = useState<Attempt | null>(null);
  const [test, setTest] = useState<Test | null>(null);
  const [passages, setPassages] = useState<PassageWithGroups[]>([]);
  const [loading, setLoading] = useState(true);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [error, setError] = useState<string | null>(null);
  const [aiFeedback, setAiFeedback] = useState<string>('');
  const [pdfLoading, setPdfLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!testId) {
        setError('No test ID provided.');
        setLoading(false);
        return;
      }

      try {
        const { data: attempts, error: attemptsError } = await supabase
          .from('reading_attempts')
          .select('id, test_id, user_id, answers, submitted_at')
          .eq('test_id', testId)
          .order('submitted_at', { ascending: false })
          .limit(1);

        if (attemptsError) throw attemptsError;
        if (!attempts?.length) throw new Error('No attempt found.');
        setAttempt({
          ...attempts[0],
          answers: JSON.parse(attempts[0].answers || '{}'),
        });

        const { data: testData, error: testError } = await supabase
          .from('reading_papers')
          .select(`
            id, title,
            reading_passages (
              id, passage_number, title, body, section_instruction, status,
              reading_questions (
                id, question_number, question_type, text, instruction, options, answer, status
              )
            )
          `)
          .eq('id', testId)
          .eq('status', 'published')
          .single();

        if (testError) throw testError;
        if (!testData) throw new Error('Test not found.');

        const passagesData = testData.reading_passages
          .filter((p: any) => p.status === 'published')
          .sort((a: any, b: any) => a.passage_number - b.passage_number)
          .map((p: any) => ({
            ...p,
            reading_questions: p.reading_questions
              .filter((q: any) => q.status === 'published')
              .sort((a: any, b: any) => a.question_number - b.question_number)
              .map((q: any) => ({
                ...q,
                options: q.options ? JSON.parse(q.options) : null,
                answer: JSON.parse(q.answer),
              })),
            question_groups: groupByInstruction(p.reading_questions),
          }));

        setTest(testData);
        setPassages(passagesData);
      } catch (err: any) {
        setError(err.message || 'Failed to load results.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [testId]);

  useEffect(() => {
    if (!attempt || !passages.length) return;

    const allQuestions = passages.flatMap(p => p.question_groups.flatMap(g => g.questions));
    let correct = 0;
    allQuestions.forEach(q => {
      const userAnswer = attempt.answers?.[q.id]?.trim().toLowerCase() || '';
      const correctAnswer = Array.isArray(q.answer) ? q.answer[0].trim().toLowerCase() : q.answer.trim().toLowerCase();
      if (userAnswer === correctAnswer) correct++;
    });

    setScore({ correct, total: allQuestions.length });
    setAiFeedback(generateAIFeedback(correct, allQuestions.length));
  }, [attempt, passages]);

  const groupByInstruction = (questions: Question[]): QuestionGroup[] => {
    const safeQuestions = questions.map(q => ({ ...q, instruction: q.instruction || 'General Questions' }));
    const groups: QuestionGroup[] = [];
    let currentInst = safeQuestions[0]?.instruction;
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
    if (block.length) groups.push({ instruction: currentInst, questions: block });
    return groups;
  };

  const generateAIFeedback = (correct: number, total: number) => {
    const percentage = (correct / total) * 100;
    if (percentage < 50) return 'Focus on improving comprehension and time management.';
    if (percentage < 80) return 'Good progress! Practice identifying key details.';
    return 'Outstanding! Maintain consistency in your preparation.';
  };

  const escapeLatex = (text: string | null | undefined) => {
    if (!text) return '';
    return text.replace(/[&%$#_{}]/g, '\\$&').replace(/\n/g, '\\\\');
  };

  const exportToPDF = async () => {
    setPdfLoading(true);
    try {
      const latexContent = generateLatexContent(test, attempt, passages, score, aiFeedback);
      const response = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ latex: latexContent }),
      });

      if (!response.ok) throw new Error('Failed to generate PDF.');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `reading_result_${testId || 'unknown'}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      setError(err.message || 'Failed to generate PDF. Please try again.');
    } finally {
      setPdfLoading(false);
    }
  };

  const generateLatexContent = (
    test: Test | null,
    attempt: Attempt | null,
    passages: PassageWithGroups[],
    score: { correct: number; total: number },
    aiFeedback: string
  ) => {
    const questions = passages.flatMap(p => p.question_groups.flatMap(g => g.questions));
    return `
\\documentclass{article}
\\usepackage{geometry}
\\geometry{a4paper, margin=1in}
\\usepackage{parskip}
\\usepackage[utf8]{inputenc}
\\usepackage[T1]{fontenc}
\\usepackage{lmodern}
\\usepackage{xcolor}
\\usepackage{enumitem}
\\usepackage{hyperref}

\\begin{document}

\\title{IELTS Reading Test Review}
\\author{}
\\date{\\today}
\\maketitle

\\section*{Test: ${escapeLatex(test?.title) || 'Untitled'}}
\\textbf{Score:} ${score.correct}/${score.total} \\quad \\textbf{Band:} ${Math.min(9, Math.max(1, (score.correct / score.total) * 9)).toFixed(1)}\\\\
\\textbf{AI Feedback:} ${escapeLatex(aiFeedback)}

\\section*{Results}
${passages.map(p => `
  \\subsection*{Passage ${p.passage_number}: ${escapeLatex(p.title) || 'Untitled'}}
  \\begin{quote}
    ${escapeLatex(p.body)}
  \\end{quote}
  ${p.question_groups.map(g => `
    \\subsubsection*{${escapeLatex(g.instruction)}}
    \\begin{enumerate}
      ${g.questions.map(q => {
        const userAnswer = attempt?.answers?.[q.id] || 'Unanswered';
        const correctAnswer = Array.isArray(q.answer) ? q.answer[0] : q.answer;
        return `
        \\item Question ${q.question_number}: ${escapeLatex(q.text)}
        \\begin{itemize}
          \\item Your Answer: ${escapeLatex(userAnswer)}
          \\item Correct Answer: ${escapeLatex(correctAnswer)}
        \\end{itemize}
        `;
      }).join('')}
    \\end{enumerate}
  `).join('')}
`).join('')}

\\end{document}
`;
  };

  if (error) {
    return (
      <motion.div
        className="p-8 text-center text-red-600 dark:text-red-400 flex items-center justify-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <AlertCircle size={20} />
        {error}
      </motion.div>
    );
  }

  if (loading) return <motion.div className="p-8 text-lg dark:text-gray-300">Loading results...</motion.div>;

  if (!test || !attempt) {
    return (
      <motion.div
        className="p-8 text-center text-red-600 dark:text-red-400 flex items-center justify-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <AlertCircle size={20} />
        No results found.
      </motion.div>
    );
  }

  const allQuestions = passages.flatMap(p => p.question_groups.flatMap(g => g.questions));
  const band = Math.min(9, Math.max(1, (score.correct / score.total) * 9));

  return (
    <motion.div
      className="min-h-screen bg-blue-50 dark:bg-gray-900 py-10 px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8">
        <header className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-blue-900 dark:text-blue-300">IELTS Reading Test Review</h1>
            <h2 className="text-xl text-blue-700 dark:text-blue-400">{test.title}</h2>
          </div>
          <button
            className={`flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 ${pdfLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={exportToPDF}
            disabled={pdfLoading}
            aria-label="Export results to PDF"
          >
            <Download size={20} />
            {pdfLoading ? 'Generating...' : 'Export PDF'}
          </button>
        </header>
        <div className="mb-6 text-center">
          <p className="text-lg font-semibold">Score: <span className="text-blue-900 dark:text-blue-300">{score.correct}/{score.total}</span></p>
          <p className="text-xl font-bold bg-gradient-to-r from-blue-600 to-green-600 text-white px-6 py-2 mt-2 inline-block rounded-lg">Band: {band.toFixed(1)}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">{aiFeedback}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <aside className="col-span-1 pr-4">
            <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-100">Navigation</h3>
            <ul className="space-y-1">
              {allQuestions.map(q => (
                <li key={q.id}>
                  <a
                    href={`#question-${q.id}`}
                    className="text-blue-600 dark:text-blue-300 hover:underline"
                    onClick={() => document.getElementById(`question-${q.id}`)?.scrollIntoView({ behavior: 'smooth' })}
                    aria-label={`Jump to question ${q.question_number}`}
                  >
                    Question {q.question_number}
                  </a>
                </li>
              ))}
            </ul>
          </aside>
          <main className="col-span-2">
            {passages.map(passage => (
              <section key={passage.id} className="mb-8">
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                  Passage {passage.passage_number}: {passage.title || 'Untitled'}
                </h3>
                <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg mb-4 whitespace-pre-wrap">{passage.body}</div>
                {passage.question_groups.map((group, idx) => (
                  <div key={idx} className="mb-6">
                    <p className="font-semibold text-gray-700 dark:text-gray-300">{group.instruction}</p>
                    {group.questions.map(q => {
                      const userAnswer = attempt.answers?.[q.id] || '';
                      const correctAnswer = Array.isArray(q.answer) ? q.answer[0] : q.answer;
                      const isCorrect = userAnswer.trim().toLowerCase() === correctAnswer.trim().toLowerCase();
                      return (
                        <div
                          key={q.id}
                          id={`question-${q.id}`}
                          className={`p-4 rounded-lg border ${isCorrect ? 'bg-green-50 dark:bg-green-900 border-green-500' : 'bg-red-50 dark:bg-red-900 border-red-500'}`}
                        >
                          <p className="font-medium">Question {q.question_number}: {q.text}</p>
                          <div className="flex justify-between text-sm">
                            <span>Your answer: {userAnswer || 'Unanswered'}</span>
                            <span>Correct answer: {correctAnswer}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </section>
            ))}
          </main>
        </div>
        <ResultReviewPanel
          unanswered={allQuestions.filter(q => !attempt.answers?.[q.id]?.trim())}
          questions={allQuestions}
          onJump={(qnId: string) => document.getElementById(`question-${qnId}`)?.scrollIntoView({ behavior: 'smooth' })}
        />
      </div>
    </motion.div>
  );
}