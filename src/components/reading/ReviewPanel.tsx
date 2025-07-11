import React from 'react';

interface Question {
  id: string;
  question_number: number;
  text: string;
}

interface ReviewPanelProps {
  questions: Question[];
  answers: Record<string, string>;
  flags: Record<string, boolean>;
  onJump: (questionId: string) => void;
  onSubmit: () => void;
}

const ReviewPanel: React.FC<ReviewPanelProps> = ({
  questions,
  answers,
  flags = {},
  onJump,
  onSubmit,
}) => {
  const flagged = questions.filter(q => flags[q.id]);
  const unanswered = questions.filter(q => {
    const answer = answers[q.id];
    return !answer || (typeof answer === 'string' && answer.trim() === '');
  });

  return (
    <div className="w-full border-t px-4 py-4 bg-gray-50 flex flex-col gap-3 shadow-inner">
      <div className="flex items-center justify-between">
        <div className="font-bold text-lg">Review Before Submit</div>
        <button
          className="bg-green-600 text-white px-5 py-2 rounded-2xl font-semibold shadow hover:bg-green-700 transition"
          onClick={onSubmit}
        >
          Submit Test
        </button>
      </div>

      <div className="flex flex-wrap gap-8 mt-2">
        <div>
          <div className="font-semibold mb-1 text-yellow-600">Flagged Questions</div>
          {flagged.length === 0 ? (
            <div className="text-gray-400 italic">None</div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {flagged.map(q => (
                <button
                  key={q.id}
                  className="bg-yellow-100 border border-yellow-400 text-yellow-700 rounded-lg px-3 py-1 text-sm font-semibold hover:bg-yellow-200 transition"
                  onClick={() => onJump(q.id)}
                >
                  {q.question_number}
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <div className="font-semibold mb-1 text-red-600">Unanswered Questions</div>
          {unanswered.length === 0 ? (
            <div className="text-gray-400 italic">None</div>
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
      </div>

      {flagged.length === 0 && unanswered.length === 0 && (
        <div className="text-green-600 font-medium text-center py-2">
          All questions answered and none flagged. Ready to submit!
        </div>
      )}

      {unanswered.length > 0 && (
        <div className="text-red-600 font-medium text-center py-2">
          <span className="text-xl">You have unanswered questions.</span> Please make sure to answer all before submitting, or you can submit anyway.
        </div>
      )}
    </div>
  );
};

export default ReviewPanel;