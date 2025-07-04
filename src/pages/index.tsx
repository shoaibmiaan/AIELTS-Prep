import Image from "next/image";
import Link from "next/link";
import Head from "next/head";

export default function Home() {
  return (
    <>
      <Head>
        <title>AIELTS Prep – Master IELTS with AI</title>
      </Head>

      <div className="bg-black text-white min-h-screen font-sans">
        {/* Navbar */}
        <header className="sticky top-0 z-50 w-full bg-black bg-opacity-80 backdrop-blur-sm border-b border-gray-800">
          <div className="flex items-center justify-between px-6 md:px-20 py-4">
            <h1 className="text-lg font-bold">AIELTS Prep</h1>
            <div className="hidden md:flex gap-6 items-center text-sm">
              <Link href="/login" className="hover:text-orange-400 transition">Login</Link>
              <Link href="/signup" className="hover:text-orange-400 transition">Signup</Link>
            </div>
          </div>
        </header>

        {/* Hero */}
        <section
          className="relative flex flex-col justify-center items-start px-6 md:px-20 py-24 min-h-[80vh] bg-cover bg-center"
          style={{ backgroundImage: "url('/hero-bg.jpg')" }}
        >
          <div className="max-w-xl animate-fadeInUp bg-black/60 p-6 rounded-xl">
            <h1 className="text-4xl sm:text-5xl font-bold leading-tight mb-4">
              Master IELTS with AI-Powered Feedback
            </h1>
            <p className="text-lg text-gray-300 mb-6">
              Get instant scoring, full mock tests, and personalized improvement plans.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/TheAssessmentRoom">
                <span className="inline-block px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition">
                  🧠 Start Testing
                </span>
              </Link>
              <Link href="/ThePrepInstitute">
                <span className="inline-block px-6 py-3 border border-orange-500 text-orange-400 hover:bg-orange-500 hover:text-white font-semibold rounded-lg transition">
                  🏛️ Learn & Prepare
                </span>
              </Link>
              <Link href="/signup">
                <span className="inline-block px-6 py-3 bg-white text-black font-semibold rounded-lg transition hover:bg-gray-200">
                  Create Free Account
                </span>
              </Link>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="px-6 md:px-20 py-16 bg-black">
          <h2 className="text-3xl font-bold text-center mb-10">Everything You Need to Succeed</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-sm text-gray-300">
            {[
              ["📊 AI Evaluation", "Band scores with instant feedback on Writing & Speaking."],
              ["📚 All 4 Modules", "Practice Reading, Writing, Listening, and Speaking."],
              ["🕒 Timed Tests", "Real exam environment with tab-switch detection."],
              ["📈 Progress Tracker", "View your performance trends and weak areas."],
            ].map(([icon, desc], i) => (
              <div key={i} className="bg-gray-800 p-6 rounded-xl hover:border-orange-500 border border-transparent transition">
                <div className="text-2xl mb-3">{icon}</div>
                <p>{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="px-6 md:px-20 py-16 flex flex-col md:flex-row items-center gap-12 bg-black">
          <div className="w-full md:w-1/2 rounded-2xl overflow-hidden shadow-lg">
            <Image src="/why.jpg" alt="why" width={800} height={500} className="object-cover w-full" />
          </div>
          <div className="w-full md:w-1/2">
            <h2 className="text-2xl font-bold mb-6">Why AIELTS Prep?</h2>
            <ul className="space-y-5 text-gray-300 text-sm">
              <li><strong className="text-white">🚀 Fast Feedback:</strong><br />Get AI-generated scores in seconds.</li>
              <li><strong className="text-white">🎯 Personalized Plans:</strong><br />Target your weak areas with focused content.</li>
              <li><strong className="text-white">💬 Speaking Practice:</strong><br />Record answers & get automatic feedback.</li>
              <li><strong className="text-white">🛡️ Reliable:</strong><br />Built by experts with real IELTS test structures.</li>
            </ul>
          </div>
        </section>

        {/* Testimonials */}
        <section className="bg-gray-900 px-6 md:px-20 py-16 text-center">
          <h2 className="text-2xl font-bold mb-10">What Students Say</h2>
          <div className="grid gap-8 md:grid-cols-3 text-sm text-gray-300">
            {[
              {
                quote: "The AI feedback on writing tasks is 🔥. I improved from Band 6 to 7.5 in 3 weeks!",
                name: "Fatima, Lahore"
              },
              {
                quote: "No other app gives full mock tests with real-time evaluation like this.",
                name: "Usman, Karachi"
              },
              {
                quote: "The speaking module is a game changer. I practiced every day with real feedback.",
                name: "Ayesha, Islamabad"
              }
            ].map((t, i) => (
              <div key={i} className="bg-gray-800 p-6 rounded-xl shadow">
                <p className="italic mb-4">“{t.quote}”</p>
                <span className="font-semibold text-orange-400">{t.name}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Pricing */}
        <section className="text-center px-6 md:px-20 py-16 bg-gradient-to-b from-black to-gray-900">
          <h2 className="text-2xl font-bold mb-10">Choose Your Plan</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "Free Trial",
                price: "$0",
                features: ["2 practice tests", "Limited AI feedback", "Basic analytics"]
              },
              {
                title: "Standard",
                price: "$19/mo",
                features: ["Unlimited practice", "Full AI scoring", "Progress tracking"]
              },
              {
                title: "Pro",
                price: "$39/mo",
                features: ["Full mock exams", "Speaking/Writing AI review", "Priority support"]
              }
            ].map((plan, i) => (
              <div key={i} className="border border-white/10 p-6 rounded-xl bg-gray-800 hover:shadow-xl hover:border-orange-500 transition">
                <h3 className="text-xl font-semibold mb-2">{plan.title}</h3>
                <p className="text-orange-400 text-2xl font-bold mb-4">{plan.price}</p>
                <ul className="space-y-2 text-gray-300 text-sm mb-6">
                  {plan.features.map((f, j) => (
                    <li key={j}>✔ {f}</li>
                  ))}
                </ul>
                <Link href="/signup">
                  <span className="inline-block px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium rounded transition">
                    Get Started
                  </span>
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="px-6 md:px-20 py-6 border-t border-gray-700 text-sm text-gray-400 flex justify-between flex-wrap gap-4">
          <div>© 2025 AIELTS Prep. All rights reserved.</div>
          <div className="space-x-4">
            <Link href="/">Home</Link>
            <Link href="/TheAssessmentRoom">🧠 Assessment Room</Link>
            <Link href="/ThePrepInstitute">🏛️ Prep Institute</Link>
            <Link href="/login">Login</Link>
            <Link href="/signup">Signup</Link>
          </div>
        </footer>
      </div>
    </>
  );
}
