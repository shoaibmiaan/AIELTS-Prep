'use client';

import Link from 'next/link';

export default function ReadingPracticeHome() {
  return (
    <div className="max-w-2xl mx-auto p-6 flex flex-col gap-8">
      {/* Heading */}
      <div>
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
          📚 IELTS Reading Practice
        </h1>
        <p className="text-gray-600 text-lg">
          Welcome! Choose your mode and boost your Reading score with exam-style practice and tips.
        </p>
      </div>

      {/* Modes */}
      <div className="flex flex-col sm:flex-row gap-6">
        {/* Practice Mode */}
        <div className="flex-1 bg-green-50 border border-green-200 rounded-2xl p-5 flex flex-col items-center shadow">
          <h2 className="text-xl font-semibold mb-1">📘 Practice Mode</h2>
          <p className="text-gray-600 mb-3 text-center text-sm">
            Work through passages and questions at your own pace.<br/>
            Hints and explanations available.
          </p>
          <Link
            href="/practice/reading/redirect?mode=practice"
            className="px-4 py-2 rounded-xl bg-green-600 text-white mt-auto hover:bg-green-700 transition"
          >
            Start Practice
          </Link>
        </div>
        {/* Live Test Mode */}
        <div className="flex-1 bg-blue-50 border border-blue-200 rounded-2xl p-5 flex flex-col items-center shadow">
          <h2 className="text-xl font-semibold mb-1">🧪 Live Test Mode</h2>
          <p className="text-gray-600 mb-3 text-center text-sm">
            Take a full-length, timed test.<br/>
            Simulates real IELTS CBT Reading.
          </p>
          <Link
            href="/practice/reading/redirect?mode=live"
            className="px-4 py-2 rounded-xl bg-blue-700 text-white mt-auto hover:bg-blue-800 transition"
          >
            Start Live Test
          </Link>
        </div>
      </div>

      {/* Tips & Instructions */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6 shadow flex flex-col gap-2">
        <h3 className="text-lg font-bold mb-2 text-yellow-700">📖 Instructions & Tips</h3>
        <ul className="list-disc ml-6 text-gray-700 space-y-1 text-sm">
          <li>You will see 3 passages and 40 questions in the real test.</li>
          <li><b>Practice Mode</b>: No timer, explanations shown, retry any question.</li>
          <li><b>Test Mode</b>: 60-minute timer, submit once, view score and solutions after finishing.</li>
          <li>Highlight keywords in questions and scan for information in the passages.</li>
          <li>Use the <span className="font-mono bg-gray-100 px-1 rounded">Flag</span> feature to review tricky questions before submitting.</li>
          <li>You can always review your previous attempts and progress.</li>
        </ul>
        <div className="mt-4 text-xs text-gray-500">
          <b>Note:</b> In Live Test Mode, once you submit, you cannot change your answers.
        </div>
      </div>
    </div>
  );
}
