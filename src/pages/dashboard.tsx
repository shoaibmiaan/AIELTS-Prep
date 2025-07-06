import { useRouter } from "next/router";
import { useAuth } from "@/context/AuthContext";
import LandingDashboardLayout from "@/layouts/LandingDashboardLayout";
import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp } from "lucide-react"; // Importing arrow icons
import { supabase } from "@/lib/supabaseClient"; // Assuming Supabase client is set up here

const tiles = [
  // The Assessment Room
  {
    title: "📖 Reading",
    desc: "Practice IELTS reading tests with instant feedback.",
    link: "/practice/reading",
    color: "bg-indigo-100 text-indigo-700",
    category: "assessmentRoom",
  },
  {
    title: "🎧 Listening",
    desc: "Play audio and answer real IELTS listening sections.",
    link: "/practice/listening",
    color: "bg-blue-100 text-blue-700",
    category: "assessmentRoom",
  },
  {
    title: "🗣️ Speaking",
    desc: "Practice with AI-evaluated speaking prompts.",
    link: "/practice/speaking/speaking",
    color: "bg-pink-100 text-pink-700",
    category: "assessmentRoom",
  },

  // The Prep Institute
  {
    title: "✍️ Writing",
    desc: "Write essays with instant AI scoring and feedback.",
    link: "/practice/writing/WritingStartPage",
    color: "bg-yellow-100 text-yellow-700",
    category: "prepInstitute",
  },
  {
    title: "📊 Progress",
    desc: "Visualize your band trends across modules.",
    link: "/profile",
    color: "bg-green-100 text-green-700",
    category: "prepInstitute",
  },
  {
    title: "🎓 Courses",
    desc: "Learn from expert teachers via recorded/live classes.",
    link: "/courses",
    color: "bg-purple-100 text-purple-700",
    category: "prepInstitute",
  },
];

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAuth();
  const userName = user?.user_metadata?.full_name || "Student";

  const [expandedSection, setExpandedSection] = useState<string | null>(null); // Track which section is expanded
  const [streak, setStreak] = useState<number>(0); // State to hold streak count

  const handleToggleSection = (section: string) => {
    setExpandedSection(prev => (prev === section ? null : section)); // Toggle the section
  };

  const bandScores = {
    Reading: 7,
    Listening: 6.5,
    Speaking: 6,
    Writing: 6.5,
  };

  // Fetching the streak count from Supabase
  useEffect(() => {
    const fetchStreakData = async () => {
      const { data, error } = await supabase
        .from('users') // Ensure this matches your actual table
        .select('streak_count')
        .eq('id', user?.id) // Assuming user.id is available
        .single();

      if (error) {
        console.error("Error fetching streak count:", error);
      } else {
        setStreak(data?.streak_count || 0); // Set streak count or default to 0
      }
    };

    if (user) {
      fetchStreakData();
    }
  }, [user]);

  return (
    <LandingDashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div>
            <h1 className="text-3xl font-bold">👋 Welcome back, {userName}</h1>
            <p className="text-gray-600 mt-1 text-sm">
              Your current goal:{" "}
              <span className="font-medium text-blue-700">Band 7+</span>
            </p>
            <p className="text-gray-600 mt-2 text-sm">
              Your current streak: <span className="font-medium text-green-700">{streak}</span>
            </p>
          </div>
          {/* Band Score Circles */}
          <div className="flex gap-4 mt-4 sm:mt-0">
            {Object.entries(bandScores).map(([skill, score], idx) => {
              const dashOffset = 138 - (score / 9) * 138;
              return (
                <div key={idx} className="relative w-16 h-16 group">
                  <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                    <circle
                      cx="50%"
                      cy="50%"
                      r="22"
                      stroke="#e5e7eb"
                      strokeWidth="5"
                      fill="none"
                    />
                    <circle
                      cx="50%"
                      cy="50%"
                      r="22"
                      stroke="#3b82f6"
                      strokeWidth="5"
                      strokeDasharray="138"
                      strokeDashoffset={dashOffset}
                      strokeLinecap="round"
                      fill="none"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-xs font-semibold text-blue-700">
                    <span>{skill[0]}</span>
                    <span className="text-[10px] text-gray-600 group-hover:text-black transition">
                      {score}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Tiles */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
          {/* The Assessment Room Section */}
          <div className="rounded-2xl bg-white shadow-lg p-6 space-y-4 border border-gray-200">
            <div className="inline-block px-4 py-2 rounded-full text-lg font-semibold mb-3 bg-orange-100 text-orange-700">
              🧠 The Assessment Room
            </div>
            <h2 className="text-xl font-semibold mb-2">
              Access full-length mock exams and track band scores.
            </h2>
            <p className="text-sm text-gray-500">
              Select a module to start
            </p>
            {/* Expandable content */}
            {expandedSection === "assessmentRoom" && (
              <div className="mt-4 space-y-4 text-sm text-gray-600">
                {tiles
                  .filter((tile) => tile.category === "assessmentRoom")
                  .map((tile, index) => (
                    <div
                      key={index}
                      onClick={() => router.push(tile.link)}
                      className="hover:text-blue-700 cursor-pointer transition-all"
                    >
                      <p>{tile.title}</p>
                    </div>
                  ))}
              </div>
            )}
            {/* Toggle arrow */}
            <div className="mt-2 text-gray-500" onClick={() => handleToggleSection("assessmentRoom")}>
              {expandedSection === "assessmentRoom" ? (
                <ChevronUp size={20} />
              ) : (
                <ChevronDown size={20} />
              )}
            </div>
          </div>

          {/* The Prep Institute Section */}
          <div className="rounded-2xl bg-white shadow-lg p-6 space-y-4 border border-gray-200">
            <div className="inline-block px-4 py-2 rounded-full text-lg font-semibold mb-3 bg-teal-100 text-teal-700">
              🏛️ The Prep Institute
            </div>
            <h2 className="text-xl font-semibold mb-2">
              Access structured learning hub, courses, and lessons.
            </h2>
            <p className="text-sm text-gray-500">
              Choose a category to explore
            </p>
            {/* Expandable content */}
            {expandedSection === "prepInstitute" && (
              <div className="mt-4 space-y-4 text-sm text-gray-600">
                {tiles
                  .filter((tile) => tile.category === "prepInstitute")
                  .map((tile, index) => (
                    <div
                      key={index}
                      onClick={() => router.push(tile.link)}
                      className="hover:text-blue-700 cursor-pointer transition-all"
                    >
                      <p>{tile.title}</p>
                    </div>
                  ))}
              </div>
            )}
            {/* Toggle arrow */}
            <div className="mt-2 text-gray-500" onClick={() => handleToggleSection("prepInstitute")}>
              {expandedSection === "prepInstitute" ? (
                <ChevronUp size={20} />
              ) : (
                <ChevronDown size={20} />
              )}
            </div>
          </div>
        </section>
      </div>
    </LandingDashboardLayout>
  );
}
