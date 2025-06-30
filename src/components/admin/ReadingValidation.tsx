// components/admin/ReadingValidation.tsx

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

const allowedTypes = [
  "Matching Information",
  "Matching Headings",
  "Matching Features",
  "Identifying Information (True/False/Not Given)",
  "Identifying Writer's Views/Claims (Yes/No/Not Given)",
  "Multiple Choice",
  "Matching Sentence Endings",
  "Sentence Completion",
  "Summary Completion",
  "Note/Table/Flow-Chart Completion",
  "Diagram Label Completion",
  "Short-answer Questions",
];

function validateTest(test: ReadingTest): string[] {
  const errors: string[] = [];

  if (!test.title || !test.type || !test.passages?.length)
    errors.push("Missing top-level fields: 'title', 'type', or 'passages'.");

  const qNumbers = new Set();
  test.passages?.forEach((p, pi) => {
    if (!p.title) errors.push(`Passage ${pi + 1} missing 'title'.`);
    if (!p.body) errors.push(`Passage ${pi + 1} missing 'body'.`);
    if (!p.questions?.length)
      errors.push(`Passage ${pi + 1} has no questions.`);
    p.questions?.forEach((q, qi) => {
      if (!q.question_number && q.question_number !== 0)
        errors.push(
          `Passage ${p.passage_number}: Q${qi + 1} missing 'question_number'.`
        );
      if (qNumbers.has(q.question_number))
        errors.push(
          `Duplicate question number ${q.question_number} (across all passages).`
        );
      else qNumbers.add(q.question_number);
      if (!q.text) errors.push(`Q${q.question_number} missing text.`);
      if (!q.question_type)
        errors.push(`Q${q.question_number} missing question_type.`);
      if (!allowedTypes.includes(q.question_type))
        errors.push(
          `Q${q.question_number} has invalid type: '${q.question_type}'.`
        );
      if (
        (q.question_type === "Multiple Choice" ||
          q.question_type === "Matching Features" ||
          q.question_type === "Matching Headings") &&
        (!q.options || q.options.length < 2)
      )
        errors.push(
          `Q${q.question_number} (${q.question_type}) must have at least 2 options.`
        );
      if (
        (q.question_type === "Multiple Choice" ||
          q.question_type === "Matching Features" ||
          q.question_type === "Matching Headings") &&
        q.options &&
        q.options.filter(Boolean).length !== q.options.length
      )
        errors.push(`Q${q.question_number} has empty option(s).`);
      if (q.answer == null || q.answer === "")
        errors.push(`Q${q.question_number} missing answer.`);
    });
  });

  return errors;
}

type Props = { data: ReadingTest | null };

export default function ReadingValidation({ data }: Props) {
  if (!data) return null;

  const errors = validateTest(data);

  if (errors.length === 0)
    return (
      <div className="p-3 mb-4 bg-green-100 border border-green-400 text-green-700 rounded">
        ✅ No schema errors found. Ready to upload.
      </div>
    );

  return (
    <div className="p-3 mb-4 bg-red-50 border border-red-400 text-red-700 rounded">
      <div className="font-semibold mb-2">
        {errors.length} error{errors.length > 1 ? "s" : ""} found:
      </div>
      <ul className="list-disc ml-6 space-y-1">
        {errors.map((err, i) => (
          <li key={i}>{err}</li>
        ))}
      </ul>
    </div>
  );
}
