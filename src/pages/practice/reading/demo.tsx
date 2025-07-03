import React, { useState } from "react";
import readingTest from "@/data/reading_test_schema_example.json";
import ReadingTestLayout from "@/components/reading/ReadingTestLayout";

// Safely get passage and questions
const passage = readingTest.passages?.[0] ?? {};
const allQuestions = Array.isArray(passage.question_groups)
  ? passage.question_groups.flatMap(g => g.questions)
  : [];

export default function DemoStudentTest() {
  const [current, setCurrent] = useState(0);

  return (
    <ReadingTestLayout
      passage={{
        passage_title: passage.title,
        passage_text: passage.body,
      }}
      progress={{
        current: current + 1,
        total: allQuestions.length,
      }}
    >
      <div>
        <div className="mb-4">
          <div className="text-sm text-gray-600 mb-2">
            {allQuestions[current]?.question_type} | Q{allQuestions[current]?.question_number}
          </div>
          <div className="font-medium mb-2">
            {allQuestions[current]?.question_text}
          </div>

          {Array.isArray(allQuestions[current]?.options) && (
            <ul className="pl-4 mb-2">
              {allQuestions[current].options.map((opt, i) => (
                <li key={i} className="mb-1">
                  <label>
                    <input type="radio" name="option" className="mr-2" disabled />
                    {opt}
                  </label>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex gap-2 mt-4">
          <button
            className="px-3 py-1 rounded bg-gray-200"
            disabled={current === 0}
            onClick={() => setCurrent((c) => c - 1)}
          >
            Previous
          </button>
          <button
            className="px-3 py-1 rounded bg-gray-800 text-white"
            disabled={current === allQuestions.length - 1}
            onClick={() => setCurrent((c) => c + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </ReadingTestLayout>
  );
}
