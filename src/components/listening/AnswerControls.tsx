import React from 'react';

interface Question {
  id: string;
  type: string;
  questionText: string;
  correctAnswer?: string | string[];
  options?: string[];
}

interface Props {
  questions: Question[];
  answers: Record<string, string | string[]>;
  onAnswerChange: (id: string, value: string) => void;
  submitted: boolean;
}

export default function InlineAnswerControls({
  questions,
  answers,
  onAnswerChange,
  submitted,
}: Props) {
  return (
    <div className="space-y-6">
      {questions.map((q, index) => {
        const userAnswer = typeof answers[q.id] === 'string' ? answers[q.id] : '';
        const isCorrect =
          submitted &&
          q.correctAnswer &&
          (Array.isArray(q.correctAnswer)
            ? q.correctAnswer.map(a => a.toLowerCase()).includes((userAnswer || '').toLowerCase())
            : (userAnswer || '').toLowerCase() === q.correctAnswer.toLowerCase());

        return (
          <div key={q.id} className="space-y-2">
            <label className="block text-base font-medium">
              {q.type === 'mcq' && q.options ? (
                <>
                  {index + 1}. {q.questionText}
                  <div className="pl-4 mt-2 space-y-1">
                    {q.options.map((opt, i) => {
                      const optLetter = String.fromCharCode(65 + i);
                      return (
                        <label key={optLetter} className="flex items-center gap-2">
                          <input
                            type="radio"
                            name={q.id}
                            value={optLetter}
                            disabled={submitted}
                            checked={userAnswer === optLetter}
                            onChange={() => onAnswerChange(q.id, optLetter)}
                          />
                          <span>
                            {optLetter}. {opt}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </>
              ) : (
                <>
                  {index + 1}.{" "}
                  {q.questionText.split('____').map((part, i, arr) =>
                    i < arr.length - 1 ? (
                      <span key={i}>
                        {part}
                        <input
                          type="text"
                          value={userAnswer}
                          onChange={(e) => onAnswerChange(q.id, e.target.value)}
                          disabled={submitted}
                          className={`mx-2 inline-block border px-2 py-1 rounded w-40 ${
                            submitted
                              ? isCorrect
                                ? 'border-green-500 text-green-700'
                                : 'border-red-500 text-red-700'
                              : 'border-gray-300'
                          }`}
                        />
                      </span>
                    ) : (
                      part
                    )
                  )}
                  {submitted && !isCorrect && (
                    <p className="text-sm text-gray-500 mt-1">
                      Correct answer: <strong>{Array.isArray(q.correctAnswer) ? q.correctAnswer.join(' / ') : q.correctAnswer}</strong>
                    </p>
                  )}
                </>
              )}
            </label>
          </div>
        );
      })}
    </div>
  );
}
