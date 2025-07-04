import { useRouter } from "next/router";
import { useAuth } from "@/context/AuthContext";
import LandingDashboardLayout from "@/layouts/LandingDashboardLayout";

const tiles = [
  {
    title: "📖 Reading",
    desc: "Practice IELTS reading tests with instant feedback.",
    link: "/practice/reading",
    color: "bg-indigo-100 text-indigo-700",
  },
  {
    title: "🎧 Listening",
    desc: "Play audio and answer real IELTS listening sections.",
    link: "/practice/listening",
    color: "bg-blue-100 text-blue-700",
  },
  {
    title: "🗣️ Speaking",
    desc: "Practice with AI-evaluated speaking prompts.",
    link: "/practice/speaking/speaking",
    color: "bg-pink-100 text-pink-700",
  },
  {
    title: "✍️ Writing",
    desc: "Write essays with instant AI scoring and feedback.",
    link: "/practice/writing/WritingStartPage",
    color: "bg-yellow-100 text-yellow-700",
  },
  {
    title: "📊 Progress",
    desc: "Visualize your band trends across modules.",
    link: "/profile",
    color: "bg-green-100 text-green-700",
  },
  {
    title: "🎓 Courses",
    desc: "Learn from expert teachers via recorded/live classes.",
    link: "/courses",
    color: "bg-purple-100 text-purple-700",
  },
];

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAuth();
  const userName = user?.user_metadata?.full_name || "Student";

  const bandScores = {
    Reading: 7,
    Listening: 6.5,
    Speaking: 6,
    Writing: 6.5,
  };

  return (
    <LandingDashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div>
            <h1 className="text-2xl font-bold">👋 Welcome back, {userName}</h1>
            <p className="text-gray-600 mt-1 text-sm">
              Your current goal:{" "}
              <span className="font-medium text-blue-700">Band 7+</span>
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
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tiles.map((tile, index) => (
            <div
              key={index}
              onClick={() => router.push(tile.link)}
              className={`group cursor-pointer rounded-2xl bg-white p-6 shadow-md border border-gray-100 hover:shadow-xl hover:border-gray-300 hover:-translate-y-[2px] transition-all`}
            >
              <div
                className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-3 ${tile.color}`}
              >
                {tile.title}
              </div>
              <h2 className="text-lg font-semibold mb-1 group-hover:text-blue-700 transition">
                {tile.desc}
              </h2>
              <div className="text-xs text-gray-400 mt-2 group-hover:translate-x-1 transition">
                Click to open →
              </div>
            </div>
          ))}
        </section>
      </div>
    </LandingDashboardLayout>
  );
}
