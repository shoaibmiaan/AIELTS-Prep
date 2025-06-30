import React, { useEffect, useState } from 'react';

const aiFacts = [
  "Did you know? Most IELTS Reading tests have 3 passages.",
  "While AI is working, try to spot a typo in your input! 👀",
  "Remember: Options for MCQs should be A, B, C, D.",
  "Taking a deep breath can increase your focus. 🧘",
  "IELTS Reading is about speed AND accuracy.",
  "“Imagination is more important than knowledge.” – Einstein",
  "Pro tip: Short answers are always single words unless told otherwise.",
  "Turtles can live for 100+ years! 🐢",
  "Fun fact: The word 'IELTS' is pronounced 'eye-elts'.",
  "Gemini is crunching your content…",
];

export default function AIWaitOverlay({ show = false }: { show: boolean }) {
  const [fact, setFact] = useState(aiFacts[Math.floor(Math.random() * aiFacts.length)]);
  const [fakeProgress, setFakeProgress] = useState(0);

  useEffect(() => {
    if (!show) return setFakeProgress(0);
    const interval1 = setInterval(() => {
      setFact(aiFacts[Math.floor(Math.random() * aiFacts.length)]);
    }, 3500);
    const interval2 = setInterval(() => setFakeProgress(p => (p < 99 ? p + 2 : p)), 100);
    return () => {
      clearInterval(interval1);
      clearInterval(interval2);
      setFakeProgress(0);
    };
  }, [show]);

  if (!show) return null;
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/60">
      <div className="w-72 bg-gray-800 rounded-full h-5 mt-2 shadow">
        <div
          className="bg-gradient-to-r from-blue-500 via-fuchsia-500 to-violet-500 h-5 rounded-full transition-all"
          style={{ width: `${fakeProgress}%` }}
        />
      </div>
      <div className="mt-6 text-white text-2xl font-bold animate-pulse">
        Working AI Magic… <span className="ml-1">🤖✨</span>
      </div>
      <div className="mt-2 text-indigo-100 text-center text-base min-h-6">{fact}</div>
      <div className="mt-4 text-sm text-indigo-200">You can edit elsewhere, or just enjoy the moment…</div>
    </div>
  );
}
