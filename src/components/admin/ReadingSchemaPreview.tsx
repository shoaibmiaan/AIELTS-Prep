// components/admin/ReadingSchemaPreview.tsx

import React from "react";

type ReadingTest = {
  type: string;
  title: string;
  passages: {
    passage_number: number;
    title: string;
    body: string;
    questions: {
      question_number: number;
      question_type: string;
      text: string;
      options?: string[];
      answer: string;
    }[];
  }[];
};

type Props = {
  data: ReadingTest | null;
};

export default function ReadingSchemaPreview({ data }: Props) {
  if (!data)
    return (
      <div className="p-4 text-gray-500 italic">No data loaded yet.</div>
    );

  const totalQuestions = data.passages.reduce(
    (sum, p) => sum + (p.questions?.length || 0),
    0
  );

  return (
    <div className="border rounded bg-white p-4 shadow mb-4">
      <div className="mb-4">
        <h2 className="text-xl font-bold">{data.title}</h2>
        <div className="text-gray-600 text-sm mb-2">Type: {data.type}</div>
        <div className="text-gray-700">
          <span className="mr-4">
            <strong>Passages:</strong> {data.passages.length}
          </span>
          <span>
            <strong>Total Questions:</strong> {totalQuestions}
          </span>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm border">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-2 py-1 border">#</th>
              <th className="px-2 py-1 border">Passage Title</th>
              <th className="px-2 py-1 border"># Questions</th>
              <th className="px-2 py-1 border">Sample Q (text)</th>
              <th className="px-2 py-1 border">Types</th>
            </tr>
          </thead>
          <tbody>
            {data.passages.map((p) => (
              <tr key={p.passage_number}>
                <td className="px-2 py-1 border">{p.passage_number}</td>
                <td className="px-2 py-1 border">{p.title}</td>
                <td className="px-2 py-1 border">{p.questions.length}</td>
                <td className="px-2 py-1 border">
                  <div className="truncate max-w-[300px]">
                    {p.questions[0]?.text}
                  </div>
                </td>
                <td className="px-2 py-1 border">
                  {[...new Set(p.questions.map((q) => q.question_type))].join(
                    ", "
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
