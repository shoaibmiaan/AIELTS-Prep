'use client';

import Link from 'next/link';

export default function ReadingPracticeHome() {
  return (
    <div className="max-w-3xl mx-auto p-8 flex flex-col gap-8 text-black">
      {/* Heading */}
      <div>
        <h1 className="text-4xl font-bold mb-4 text-[#002060]">
          📚 IELTS Reading Practice
        </h1>
        <p className="text-gray-600 text-lg mb-6">
          Welcome! Choose your mode and boost your Reading score with exam-style practice and tips.
        </p>
      </div>

      {/* Modes Section */}
      <div className="flex flex-col sm:flex-row gap-6">
        {/* Practice Mode */}
        <div className="flex-1 bg-[#f0f9ff] border border-[#99ccff] rounded-2xl p-6 flex flex-col items-center shadow-lg hover:bg-[#e6f4ff] transition-all">
          <h2 className="text-2xl font-semibold mb-2 text-[#0066cc]">📘 Practice Mode</h2>
          <p className="text-gray-600 mb-4 text-center text-sm">
            Work through passages and questions at your own pace.<br />
            Hints and explanations available.
          </p>
          <Link
            href="/practice/reading/redirect?mode=practice"
            className="px-6 py-3 rounded-xl bg-[#0066cc] text-white mt-auto hover:bg-[#005bb5] transition"
          >
            Start Practice
          </Link>
        </div>

        {/* Live Test Mode */}
        <div className="flex-1 bg-[#e9f4f0] border border-[#80e0a3] rounded-2xl p-6 flex flex-col items-center shadow-lg hover:bg-[#d8f2e5] transition-all">
          <h2 className="text-2xl font-semibold mb-2 text-[#008000]">🧪 Live Test Mode</h2>
          <p className="text-gray-600 mb-4 text-center text-sm">
            Take a full-length, timed test.<br />
            Simulates real IELTS CBT Reading.
          </p>
          <Link
            href="/practice/reading/redirect?mode=live"
            className="px-6 py-3 rounded-xl bg-[#008000] text-white mt-auto hover:bg-[#006f00] transition"
          >
            Start Live Test
          </Link>
        </div>
      </div>

      {/* Tips & Instructions Section */}
      <div className="bg-[#fff4e5] border border-[#ffcc80] rounded-2xl p-8 shadow-lg mt-8">
        <h3 className="text-xl font-bold mb-4 text-[#ff6600]">📖 Instructions & Tips</h3>
        <ul className="list-disc ml-6 text-gray-600 space-y-2 text-sm">
          <li>You will see 3 passages and 40 questions in the real test.</li>
          <li><b>Practice Mode</b>: No timer, explanations shown, retry any question.</li>
          <li><b>Test Mode</b>: 60-minute timer, submit once, view score and solutions after finishing.</li>
          <li>Highlight keywords in questions and scan for information in the passages.</li>
          <li>Use the <span className="font-mono bg-gray-800 text-white px-2 rounded">Flag</span> feature to review tricky questions before submitting.</li>
          <li>You can always review your previous attempts and progress.</li>
        </ul>
        <div className="mt-4 text-xs text-gray-500">
          <b>Note:</b> In Live Test Mode, once you submit, you cannot change your answers.
        </div>
      </div>
    </div>
  );
}
