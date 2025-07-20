'use client';

import Link from 'next/link';
import PerformanceChart from '@/components/PerformanceChart';

export default function WritingStartPage() {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded shadow mt-10">
      <h1 className="text-3xl font-bold mb-6 text-center">IELTS Writing Practice</h1>

      <p className="text-gray-700 mb-8 text-center">
        Choose a task type to begin practicing your IELTS writing skills with AI feedback.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link href="/assessmentRoom/writing/WritingTask1">
          <div className="border rounded-lg p-6 hover:shadow-lg cursor-pointer transition bg-blue-50 hover:bg-blue-100">
            <h2 className="text-xl font-semibold mb-2">Task 1</h2>
            <p className="text-sm text-gray-600">
              Practice letters (General) or diagrams (Academic). Minimum 150 words required.
            </p>
          </div>
        </Link>

        <Link href="/assessmentRoom/writing/WritingTask2">
          <div className="border rounded-lg p-6 hover:shadow-lg cursor-pointer transition bg-green-50 hover:bg-green-100">
            <h2 className="text-xl font-semibold mb-2">Task 2</h2>
            <p className="text-sm text-gray-600">
              Practice writing essays that respond to a viewpoint or argument. Minimum 250 words.
            </p>
          </div>
        </Link>
      </div>

      {/* Performance Summary Section */}
      <div className="mt-10 p-6 bg-yellow-50 border rounded shadow-sm">
        <h2 className="text-2xl font-semibold mb-4">📝 Your Performance Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded border">
            <h3 className="text-lg font-semibold text-blue-600">Task 1</h3>
            <p>📊 Average Band Score: <strong>6.5</strong></p>
            <p>💬 Feedback: Work on coherence and logical flow.</p>
          </div>
          <div className="bg-white p-4 rounded border">
            <h3 className="text-lg font-semibold text-green-600">Task 2</h3>
            <p>📊 Average Band Score: <strong>7.0</strong></p>
            <p>💬 Feedback: Excellent structure. Try using more varied vocabulary.</p>
          </div>
        </div>
      </div>

      {/* Chart */}
      <PerformanceChart />

      {/* History Link */}
      <div className="text-center mt-8">
        <Link href="/assessmentRoom/writing-history" className="text-blue-600 hover:underline">
          📜 View My Writing History
        </Link>
      </div>
    </div>
  );
}
