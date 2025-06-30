// src/components/listening/Instructions.tsx

export default function Instructions() {
  return (
    <div className="bg-yellow-50 border border-yellow-300 p-4 rounded">
      <h2 className="text-lg font-semibold mb-2">Listening Test Instructions</h2>
      <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
        <li>You will hear a recording. Answer the questions as you listen.</li>
        <li>Read each question carefully and write your answer clearly.</li>
        <li>You can adjust the playback speed and jump to any time.</li>
        <li>This test contains 60 questions divided into 4 sections.</li>
      </ul>
    </div>
  );
}
