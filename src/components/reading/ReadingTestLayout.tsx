// src/components/reading/ReadingTestLayout.tsx
import React from "react";

export default function ReadingTestLayout({ passage, progress, children }: {
  passage: { title: string; body: string };
  progress: { current: number; total: number };
  children: React.ReactNode;
}) {
  return (
    <div className="w-full min-h-screen bg-gray-50 p-0 m-0 flex flex-col">
      <header className="bg-white shadow px-4 py-3 sticky top-0 z-10">
        <div className="text-2xl font-bold">{passage.title}</div>
        <div className="text-sm text-gray-500">
          Progress: <span className="font-semibold">{progress.current} / {progress.total}</span>
        </div>
      </header>
      <main className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 px-4 py-4">
        {/* Passage */}
        <section className="bg-white rounded-xl shadow p-5 text-base overflow-auto">
          <div className="text-lg font-semibold mb-3">Passage</div>
          <div className="whitespace-pre-line">{passage.body}</div>
        </section>
        {/* Questions Panel */}
        <section className="bg-white rounded-xl shadow p-5">
          {children}
        </section>
      </main>
    </div>
  );
}
