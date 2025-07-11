// src/components/reading/ReadingTestLayout.tsx
import React from "react";

export default function ReadingTestLayout({ passage, progress, children }: {
  passage: { title: string; body: string };
  progress: { current: number; total: number };
  children: React.ReactNode;
}) {
  return (
    <div className="w-full min-h-screen bg-white p-0 m-0 flex flex-col">
      <header className="bg-white shadow-md px-6 py-4 sticky top-0 z-10 border-b">
        <div className="text-4xl font-bold text-gray-900 text-center">IELTS Reading Test</div>
      </header>
      <header className="bg-white shadow-md px-6 py-4 sticky top-0 z-10 border-b mt-2">
        <div className="text-3xl font-bold text-gray-900">{passage.title}</div>
        <div className="text-sm text-gray-500 mt-1">
          <strong>Progress:</strong> {progress.current} / {progress.total}
        </div>
      </header>
      <div className="w-full bg-white px-6 py-3 border-b">
        <div className="text-xl font-semibold">Time Left: 59:52</div>
      </div>
      <div className="w-full px-6 py-4 bg-gray-100 text-2xl font-bold">
        <div>Questions</div>
      </div>
      <main className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-8 px-8 py-8">
        <section className="bg-white rounded-xl shadow-md p-8 text-base overflow-auto border border-gray-300">
          <div className="text-2xl font-semibold mb-6 text-gray-800">Passage</div>
          <div className="whitespace-pre-line leading-relaxed text-gray-700">
            {passage.body}
          </div>
        </section>
        <section className="bg-white rounded-xl shadow-md p-8 border border-gray-300">
          {children}
        </section>
      </main>
    </div>
  );
}