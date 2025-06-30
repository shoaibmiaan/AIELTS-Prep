import React from 'react';
import { useRouter } from 'next/router';

const followUpQuestions = [
  'Why do you think some people become inspirational?',
  'Can inspiration come from people you have never met?',
  'How do people show appreciation to their role models?',
  'Do you think social media influences who inspires us?',
];

const SpeakingPart3 = () => {
  const router = useRouter();

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Speaking Practice - Part 3</h2>
      <p className="mb-6 text-gray-600">
        Here are some follow-up questions. Think about your answers carefully.
      </p>

      <ul className="list-disc pl-6 space-y-4 mb-6">
        {followUpQuestions.map((q, idx) => (
          <li key={idx} className="text-gray-800">{q}</li>
        ))}
      </ul>

      <div className="flex justify-between">
        <button
          onClick={() => router.push('/practice/speaking/part2')}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          ← Back to Part 2
        </button>
        <button
          onClick={() => router.push('/practice/speaking')}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Finish Practice
        </button>
      </div>
    </div>
  );
};

export default SpeakingPart3;
