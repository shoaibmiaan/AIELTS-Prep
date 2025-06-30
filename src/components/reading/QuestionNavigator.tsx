// src/components/reading/QuestionNavigator.tsx
import React from 'react';

interface Question {
  id: string;
  question_number: number;
}

interface QuestionNavigatorProps {
  questions: Question[];
  answers: Record<string, string>;
  flags: Record<string, boolean>;
  onJump: (questionId: string) => void;
}

const QuestionNavigator: React.FC<QuestionNavigatorProps> = ({
  questions, answers, flags, onJump
}) => (
  <div className="sticky top-0 bg-white z-10 p-2 flex flex-wrap gap-2 mb-4">
    {questions
      .sort((a, b) => a.question_number - b.question_number)
      .map(q => (
        <button
          key={q.id}
          className={`w-8 h-8 rounded-full border text-sm font-semibold
            ${flags[q.id] ? 'bg-yellow-400' :
              answers[q.id] ? 'bg-green-200' : 'bg-gray-200'}`}
          onClick={() => onJump(q.id)}
          type="button"
        >
          {q.question_number}
        </button>
      ))}
  </div>
);

export default QuestionNavigator;
