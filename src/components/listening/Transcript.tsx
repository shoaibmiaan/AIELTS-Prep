// src/components/listening/Transcript.tsx
interface Line {
  time: number;   // seconds
  text: string;
}

interface TranscriptProps {
  currentTime: number;
  transcript: Line[];
}

export default function Transcript({ currentTime, transcript }: TranscriptProps) {
  return (
    <div className="w-full bg-white p-4 rounded shadow space-y-1 max-h-48 overflow-y-auto">
      {transcript.map((line, idx) => {
        const isActive = currentTime >= line.time;
        return (
          <p
            key={idx}
            className={`transition-colors ${
              isActive ? 'bg-primary/20 text-primary font-medium' : 'text-gray-700'
            } p-1 rounded`}
          >
            {line.text}
          </p>
        );
      })}
    </div>
  );
}
