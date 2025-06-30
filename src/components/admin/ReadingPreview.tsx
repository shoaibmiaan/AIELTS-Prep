import React from 'react';

interface ReadingQuestion {
  id?: string;
  question_number: number;
  question_type: string;
  text: string;
  instruction?: string | null;
  options?: string[] | null;
  answer?: string | string[] | null;
  status?: string;
  created_at?: string;
  updated_at?: string;
}

interface ReadingPassage {
  id?: string;
  passage_number: number;
  title: string;
  body: string;
  section_instruction?: string | null;
  status?: string;
  created_at?: string;
  updated_at?: string;
  questions?: ReadingQuestion[];
}

interface ReadingPaper {
  id?: string;
  title: string;
  type: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
  passages: ReadingPassage[];
}

interface Props {
  paper: ReadingPaper | null | undefined;
}

export default function ReadingPreview({ paper }: Props) {
  if (!paper) return null;

  return (
    <div className="mt-6 border-t pt-4">
      <h3 className="text-2xl font-semibold mb-2">👁️ Preview: {paper.title}</h3>
      <p className="text-sm text-gray-600 mb-4">
        Type: {paper.type} {paper.status && <>| Status: {paper.status}</>}
        {paper.id && <> | Paper ID: <span className="font-mono">{paper.id}</span></>}
      </p>
      {paper.passages.map((p) => (
        <div key={p.passage_number} className="mb-6 p-4 border rounded bg-white shadow-sm">
          <h4 className="text-lg font-bold mb-1">
            Passage {p.passage_number}: {p.title}
          </h4>
          <div className="text-gray-700 text-sm whitespace-pre-line mb-4">
            {p.body?.slice(0, 800)}
            {p.body && p.body.length > 800 && <>…</>}
          </div>
          {p.section_instruction && (
            <div className="italic text-xs text-gray-600 mb-2">
              {p.section_instruction}
            </div>
          )}
          <ol className="list-decimal pl-5 space-y-2">
            {(Array.isArray(p.questions) ? p.questions : []).map((q) => (
              <li key={q.question_number}>
                <div className="text-sm">
                  <span className="font-medium">Q{q.question_number} ({q.question_type})</span>
                  : {q.text}
                  {q.instruction && (
                    <div className="italic text-xs text-gray-600">{q.instruction}</div>
                  )}
                  {Array.isArray(q.options) && q.options.length > 0 && (
                    <ul className="list-disc pl-6 text-gray-600 text-xs mt-1">
                      {q.options.map((opt, idx) => (
                        <li key={idx}>{opt}</li>
                      ))}
                    </ul>
                  )}
                  {q.answer && (
                    <div className="text-xs text-green-700 mt-1">
                      <span className="font-semibold">Answer:</span>{' '}
                      {Array.isArray(q.answer) ? q.answer.join(', ') : q.answer}
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </div>
      ))}
    </div>
  );
}
