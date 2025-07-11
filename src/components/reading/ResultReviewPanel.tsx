import React from 'react';

interface Question {
  id: string;
  question_number: number;
  text: string;
}

interface ResultReviewPanelProps {
  questions: Question[];
  unanswered: Question[];
  onJump: (questionId: string) => void;
}

const ResultReviewPanel: React.FC<ResultReviewPanelProps> = ({
  questions,
  unanswered,
  onJump,
}) => (
  <div className="w-full border-t px-4 py-4 bg-gray-50 flex flex-col gap-3 shadow-inner">
    <div className="font-bold text-lg">Test Review</div>

    <div>
      <div className="font-semibold mb-1 text-red-600">Unanswered Questions</div>
      {unanswered.length === 0 ? (
        <div className="text-gray-400 italic">All questions answered</div>
      ) : (
        <div className="flex flex-wrap gap-2">
          {unanswered.map(q => (
            <button
              key={q.id}
              className="bg-red-100 border border-red-400 text-red-700 rounded-lg px-3 py-1 text-sm font-semibold hover:bg-red-200 transition"
              onClick={() => onJump(q.id)}
            >
              {q.question_number}
            </button>
          ))}
        </div>
      )}
    </div>

    <div>
      <div className="font-semibold mb-1 text-blue-600">All Questions</div>
      <div className="flex flex-wrap gap-2">
        {questions.map(q => (
          <button
            key={q.id}
            className="bg-blue-100 border border-blue-400 text-blue-700 rounded-lg px-3 py-1 text-sm font-semibold hover:bg-blue-200 transition"
            onClick={() => onJump(q.id)}
          >
            {q.question_number}
          </button>
        ))}
      </div>
    </div>
  </div>
);

export default ResultReviewPanel;
