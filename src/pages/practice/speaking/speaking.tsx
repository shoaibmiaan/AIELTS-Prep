import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  FaMicrophone,
  FaRegClock,
  FaComments,
  FaCheckCircle,
  FaRedoAlt,
} from 'react-icons/fa';

const parts = [
  {
    id: 'part1',
    href: '/practice/speaking/part1',
    title: 'Part 1: Introduction & Interview',
    description: 'Answer simple questions about yourself and familiar topics.',
    bgColor: 'bg-blue-600',
    hoverColor: 'hover:bg-blue-700',
    icon: <FaMicrophone size={24} />,
  },
  {
    id: 'part2',
    href: '/practice/speaking/part2',
    title: 'Part 2: Long Turn',
    description: 'Speak on a given topic for 1-2 minutes after 1 minute prep.',
    bgColor: 'bg-green-600',
    hoverColor: 'hover:bg-green-700',
    icon: <FaRegClock size={24} />,
  },
  {
    id: 'part3',
    href: '/practice/speaking/part3',
    title: 'Part 3: Discussion',
    description: 'Discuss abstract ideas and issues related to Part 2 topic.',
    bgColor: 'bg-purple-600',
    hoverColor: 'hover:bg-purple-700',
    icon: <FaComments size={24} />,
  },
];

const getCompletedParts = (): string[] => {
  if (typeof window === 'undefined') return [];
  try {
    const saved = localStorage.getItem('completedSpeakingParts');
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

export function markPartComplete(partId: string) {
  if (typeof window === 'undefined') return;
  const completed = getCompletedParts();
  if (!completed.includes(partId)) {
    const updated = [...completed, partId];
    localStorage.setItem('completedSpeakingParts', JSON.stringify(updated));
  }
}

export default function SpeakingLanding() {
  const [completedParts, setCompletedParts] = useState<string[]>([]);
  const [showHero, setShowHero] = useState(false);

  useEffect(() => {
    setShowHero(true);
    setCompletedParts(getCompletedParts());

    const onStorage = (e: StorageEvent) => {
      if (e.key === 'completedSpeakingParts') {
        setCompletedParts(getCompletedParts());
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const resetProgress = () => {
    if (confirm('Are you sure you want to reset your progress?')) {
      localStorage.removeItem('completedSpeakingParts');
      setCompletedParts([]);
    }
  };

  return (
    <div className="relative z-10">
      <WatermarkOverlay />
      <div className="max-w-5xl mx-auto mt-10 p-8 bg-white rounded-lg shadow-xl relative z-10">
        {/* Hero section */}
        <div
          className={`flex flex-col items-center mb-6 opacity-0 transform translate-y-10 transition-all duration-700 ${
            showHero ? 'opacity-100 translate-y-0' : ''
          }`}
          aria-label="Welcome hero section"
        >
          <h1 className="text-5xl font-extrabold text-gray-900 mb-4 text-center">
            Welcome to IELTS Speaking Practice
          </h1>
          <p className="text-gray-700 max-w-xl text-center mb-6 px-4 sm:px-0">
            Master your IELTS Speaking skills by practicing each part with tailored exercises.
            Track your progress and boost your confidence.
          </p>
          <img
            src="/speaking-hero.svg"
            alt="Illustration of speaking practice"
            className="w-full max-w-md"
            loading="lazy"
            draggable={false}
          />
        </div>

        {/* Reset Progress Button */}
        <div className="flex justify-end mb-8">
          <button
            onClick={resetProgress}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
            aria-label="Reset progress"
            type="button"
          >
            <FaRedoAlt />
            Reset Progress
          </button>
        </div>

        {/* Practice parts grid */}
        <div className="grid gap-8 sm:grid-cols-3">
          {parts.map(({ id, href, title, description, bgColor, hoverColor, icon }) => {
            const isCompleted = completedParts.includes(id);

            return (
              <Link
                key={href}
                href={href}
                className={`relative flex flex-col items-center text-white rounded-lg p-6 shadow-md transition-transform transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-indigo-500 ${bgColor} ${hoverColor}`}
                aria-label={`Practice ${title}${isCompleted ? ', completed' : ''}`}
              >
                <div className="mb-4">{icon}</div>
                <h2 className="text-xl font-semibold mb-2 text-center">{title}</h2>
                <p className="text-center text-white/90 text-sm">{description}</p>

                {isCompleted && (
                  <div title="Completed" className="absolute top-3 right-3 text-green-300">
                    <FaCheckCircle size={28} />
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function WatermarkOverlay() {
  const [positions, setPositions] = useState<
    { top: number; left: number; rotation: number; fontSize: number; opacity: number }[]
  >([]);

  useEffect(() => {
    const generated = [];
    const attempts = 500;
    const minDistance = 160;

    for (let i = 0; i < 20 && generated.length < 20; i++) {
      let placed = false;
      let tries = 0;

      while (!placed && tries < attempts) {
        const fontSize = Math.floor(Math.random() * 20) + 36; // 36–56
        const top = Math.random() * (window.innerHeight - fontSize);
        const left = Math.random() * (window.innerWidth - 300);
        const rotation = Math.floor(Math.random() * 90) - 45;
        const opacity = Math.random() * 0.08 + 0.03;

        const tooClose = generated.some((pos) => {
          const dx = pos.left - left;
          const dy = pos.top - top;
          const distance = Math.sqrt(dx * dx + dy * dy);
          return distance < Math.max(minDistance, (pos.fontSize + fontSize) / 1.5);
        });

        if (!tooClose) {
          generated.push({ top, left, rotation, fontSize, opacity });
          placed = true;
        }
        tries++;
      }
    }

    setPositions(generated);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {positions.map((pos, idx) => (
        <span
          key={idx}
          className="absolute text-gray-300 font-extrabold whitespace-nowrap select-none"
          style={{
            top: pos.top,
            left: pos.left,
            transform: `rotate(${pos.rotation}deg)`,
            opacity: pos.opacity,
            fontSize: pos.fontSize,
          }}
        >
          SPEAK WITH IYLSA
        </span>
      ))}
    </div>
  );
}
