import { useRouter } from 'next/router';

interface UserProgress {
  writing: number;
  listening: number;
  speaking: number;
  reading: number;
  overall: number;
  targetBand: number;
}

interface GuestContentProps {
  darkMode: boolean;
  handleProtectedClick: (route: string) => void;
  startMockTest: () => void;
  analyzeWriting: () => void;
  startSpeakingPractice: () => void;
}

export default function GuestContent({
  darkMode,
  handleProtectedClick,
  startMockTest,
  analyzeWriting,
  startSpeakingPractice
}: GuestContentProps) {
  const router = useRouter();
  const userProgress: UserProgress = {
    writing: 30,
    listening: 0,
    speaking: 0,
    reading: 45,
    overall: 5.0,
    targetBand: 6.0
  };

  return (
    <>
      {/* Hero Section */}
      <section className="hero-bg text-white py-20 md:py-32">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Master IELTS with AI-Powered Feedback</h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">Personalized learning, mock tests, and expert strategies for all four modules.</p>
          <div className="flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-6">
            <button
              className="bg-yellow-600 hover:bg-yellow-700 text-white px-8 py-3 rounded-md font-medium text-lg"
              onClick={startMockTest}
            >
              Try Free Mock Test
            </button>
            <button
              className="bg-white hover:bg-gray-100 text-yellow-600 px-8 py-3 rounded-md font-medium text-lg"
              onClick={() => handleProtectedClick('/courses')}
            >
              Explore Courses
            </button>
            <button
              className="bg-white hover:bg-gray-100 text-yellow-600 px-8 py-3 rounded-md font-medium text-lg"
              onClick={() => handleProtectedClick('/premium-dashboard')}
            >
              Premium Dashboard
            </button>
          </div>
          <div className="mt-10 flex flex-wrap justify-center items-center gap-6 text-sm">
            <div className="flex items-center">
              <i className="fas fa-users mr-2"></i>
              <span>Used by 100K+ students</span>
            </div>
            <div className="flex items-center">
              <i className="fas fa-star text-yellow-400 mr-1"></i>
              <span>4.9 (2K+ reviews)</span>
            </div>
            <img src="https://via.placeholder.com/100x30?text=British+Council" alt="Partner" className="h-6 opacity-80" />
            <img src="https://via.placeholder.com/80x30?text=IDP" alt="Partner" className="h-6 opacity-80" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white dark:bg-black">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12 dark:text-white">Your Complete IELTS Toolkit</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 - AI Writing Evaluator */}
            <div className="feature-card bg-white dark:bg-gray-900 p-6 rounded-xl shadow-md border border-gray-100 dark:border-gray-800 transition-all duration-300">
              <div className="w-14 h-14 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center mb-4">
                <i className="fas fa-edit text-yellow-600 dark:text-yellow-400 text-2xl"></i>
              </div>
              <h3 className="text-xl font-semibold mb-3 dark:text-white">AI Writing Evaluator</h3>
              <p className="text-gray-600 dark:text-gray-300">Get band-specific feedback on your essays with detailed corrections.</p>
              <button
                onClick={analyzeWriting}
                className="mt-4 inline-block text-yellow-600 dark:text-yellow-400 font-medium"
              >
                Try Now →
              </button>
            </div>

            {/* Feature 2 - Speaking Simulator */}
            <div className="feature-card bg-white dark:bg-gray-900 p-6 rounded-xl shadow-md border border-gray-100 dark:border-gray-800 transition-all duration-300">
              <div className="w-14 h-14 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mb-4">
                <i className="fas fa-microphone-alt text-purple-600 dark:text-purple-400 text-2xl"></i>
              </div>
              <h3 className="text-xl font-semibold mb-3 dark:text-white">Speaking Simulator</h3>
              <p className="text-gray-600 dark:text-gray-300">Practice with AI partners in UK/US/AUS accents and get instant feedback.</p>
              <button
                onClick={startSpeakingPractice}
                className="mt-4 inline-block text-purple-600 dark:text-purple-400 font-medium"
              >
                Start Practice →
              </button>
            </div>

            {/* Feature 3 - Full Mock Tests */}
            <div className="feature-card bg-white dark:bg-gray-900 p-6 rounded-xl shadow-md border border-gray-100 dark:border-gray-800 transition-all duration-300">
              <div className="w-14 h-14 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-4">
                <i className="fas fa-clock text-green-600 dark:text-green-400 text-2xl"></i>
              </div>
              <h3 className="text-xl font-semibold mb-3 dark:text-white">Full Mock Tests</h3>
              <p className="text-gray-600 dark:text-gray-300">Timed tests with real band score predictions for all four modules.</p>
              <button
                onClick={startMockTest}
                className="mt-4 inline-block text-green-600 dark:text-green-400 font-medium"
              >
                Take Test →
              </button>
            </div>

            {/* Feature 4 - Progress Analytics */}
            <div className="feature-card bg-white dark:bg-gray-900 p-6 rounded-xl shadow-md border border-gray-100 dark:border-gray-800 transition-all duration-300">
              <div className="w-14 h-14 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center mb-4">
                <i className="fas fa-chart-line text-orange-600 dark:text-orange-400 text-2xl"></i>
              </div>
              <h3 className="text-xl font-semibold mb-3 dark:text-white">Progress Analytics</h3>
              <p className="text-gray-600 dark:text-gray-300">Track your weaknesses and improvements with detailed reports.</p>
              <button
                onClick={() => handleProtectedClick('/progress')}
                className="mt-4 inline-block text-orange-600 dark:text-orange-400 font-medium"
              >
                View Dashboard →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Personalized CTA */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
            <div className="md:flex">
              <div className="md:w-1/2 p-8 md:p-12 bg-yellow-600 text-white">
                <h2 className="text-2xl font-bold mb-4">Continue Your Journey</h2>
                <p className="mb-6">Pick up where you left off and maintain your streak!</p>
                <div className="flex items-center mb-6">
                  <div className="relative w-16 h-16 mr-4">
                    <svg className="w-full h-full" viewBox="0 0 36 36">
                      <circle cx="18" cy="18" r="16" fill="none" stroke="#e2e8f0" strokeWidth="2"></circle>
                      <circle
                        id="writing-progress"
                        className="progress-ring__circle"
                        cx="18"
                        cy="18"
                        r="16"
                        fill="none"
                        stroke="#ffffff"
                        strokeWidth="2"
                        strokeDasharray="100 100"
                        strokeDashoffset="70"
                      ></circle>
                      <text x="18" y="20" textAnchor="middle" fontSize="10" fill="white">
                        {userProgress.writing}%
                      </text>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold">Writing Task 2: Opinion Essays</h3>
                    <p className="text-sm opacity-80">Your next recommended lesson</p>
                  </div>
                </div>
                <button
                  className="bg-white text-yellow-600 px-6 py-2 rounded-md font-medium"
                  onClick={() => handleProtectedClick('/continue-writing')}
                >
                  Continue
                </button>
              </div>
              <div className="md:w-1/2 p-8 md:p-12">
                <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">New to IELTSMaster?</h2>
                <p className="mb-6 text-gray-600 dark:text-gray-300">Take our 10-minute diagnostic test to get personalized recommendations.</p>
                <button
                  className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-2 rounded-md font-medium"
                  onClick={() => handleProtectedClick('/assessmentRoom')}
                >
                  Start Assessment
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Learning Module Preview */}
      <section className="py-16 bg-white dark:bg-black">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-6 dark:text-white">Structured Learning Paths</h2>
          <p className="text-center text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-12">Progress through carefully designed courses tailored to your target band score.</p>

          <div className="flex justify-center mb-8">
            <div className="inline-flex rounded-md shadow-sm">
              <button className="px-4 py-2 text-sm font-medium rounded-l-lg bg-yellow-600 text-white">
                Academic
              </button>
              <button className="px-4 py-2 text-sm font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                General Training
              </button>
              <button className="px-4 py-2 text-sm font-medium rounded-r-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                Beginner to Advanced
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Lesson 1 */}
            <div className="border dark:border-gray-800 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-5">
                <div className="flex justify-between mb-3">
                  <span className="text-sm font-medium text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900 px-2 py-1 rounded">Grammar</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">{userProgress.writing}%</span>
                </div>
                <h3 className="font-semibold text-lg mb-2 dark:text-white">Complex Sentences</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">Master compound-complex structures for Band 7+ writing.</p>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-yellow-600 h-2 rounded-full"
                    style={{ width: `${userProgress.writing}%` }}
                  ></div>
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-900 px-5 py-3 border-t dark:border-gray-800 flex justify-between items-center">
                <span className="text-sm text-gray-500 dark:text-gray-400"><i className="far fa-clock mr-1"></i> 25 min</span>
                <button
                  className="text-sm text-yellow-600 dark:text-yellow-400 font-medium"
                  onClick={() => handleProtectedClick('/complex-sentences')}
                >
                  Continue
                </button>
              </div>
            </div>

            {/* Lesson 2 */}
            <div className="border dark:border-gray-800 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-5">
                <div className="flex justify-between mb-3">
                  <span className="text-sm font-medium text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900 px-2 py-1 rounded">Listening</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {userProgress.listening > 0 ? `${userProgress.listening}%` : 'Locked'}
                  </span>
                </div>
                <h3 className="font-semibold text-lg mb-2 dark:text-white">Map Labelling</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">Strategies for Section 2 map-based questions.</p>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className={`${userProgress.listening > 0 ? 'bg-purple-600' : 'bg-gray-200 dark:bg-gray-700'} h-2 rounded-full`}
                    style={{ width: `${userProgress.listening}%` }}
                  ></div>
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-900 px-5 py-3 border-t dark:border-gray-800 flex justify-between items-center">
                <span className="text-sm text-gray-500 dark:text-gray-400"><i className="far fa-clock mr-1"></i> 35 min</span>
                {userProgress.listening > 0 ? (
                  <button
                    className="text-sm text-purple-600 dark:text-purple-400 font-medium"
                    onClick={() => handleProtectedClick('/map-labelling')}
                  >
                    Continue
                  </button>
                ) : (
                  <button className="text-sm text-gray-400 font-medium" disabled>
                    Complete Previous
                  </button>
                )}
              </div>
            </div>

            {/* Lesson 3 */}
            <div className="border dark:border-gray-800 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-5">
                <div className="flex justify-between mb-3">
                  <span className="text-sm font-medium text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900 px-2 py-1 rounded">Speaking</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {userProgress.speaking > 0 ? `${userProgress.speaking}%` : '0%'}
                  </span>
                </div>
                <h3 className="font-semibold text-lg mb-2 dark:text-white">Part 3 Strategies</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">Develop extended answers for abstract questions.</p>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full"
                    style={{ width: `${userProgress.speaking}%` }}
                  ></div>
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-900 px-5 py-3 border-t dark:border-gray-800 flex justify-between items-center">
                <span className="text-sm text-gray-500 dark:text-gray-400"><i className="far fa-clock mr-1"></i> 45 min</span>
                <button
                  className="text-sm text-green-600 dark:text-green-400 font-medium"
                  onClick={() => handleProtectedClick('/speaking-part3')}
                >
                  {userProgress.speaking > 0 ? 'Continue' : 'Start'}
                </button>
              </div>
            </div>
          </div>

          <div className="text-center mt-10">
            <button
              className="px-6 py-2 border border-yellow-600 dark:border-yellow-400 text-yellow-600 dark:text-yellow-400 rounded-md font-medium hover:bg-yellow-50 dark:hover:bg-gray-800"
              onClick={() => handleProtectedClick('/courses')}
            >
              View All Courses
            </button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-6 dark:text-white">Success Stories</h2>
          <p className="text-center text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-12">85% of our users improve by 1+ band score within 3 months</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                  <img src="https://randomuser.me/api/portraits/women/32.jpg" alt="User" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="font-semibold dark:text-white">Priya K.</h4>
                  <div className="flex">
                    <i className="fas fa-star text-yellow-400"></i>
                    <i className="fas fa-star text-yellow-400"></i>
                    <i className="fas fa-star text-yellow-400"></i>
                    <i className="fas fa-star text-yellow-400"></i>
                    <i className="fas fa-star text-yellow-400"></i>
                  </div>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">"The AI writing feedback helped me identify my grammatical errors. I improved from Band 6 to 7.5 in just 2 months!"</p>
              <div className="bg-yellow-50 dark:bg-yellow-900 px-3 py-2 rounded inline-block">
                <span className="text-yellow-600 dark:text-yellow-400 text-sm font-medium">Academic IELTS</span>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                  <img src="https://randomuser.me/api/portraits/men/45.jpg" alt="User" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="font-semibold dark:text-white">Ahmed R.</h4>
                  <div className="flex">
                    <i className="fas fa-star text-yellow-400"></i>
                    <i className="fas fa-star text-yellow-400"></i>
                    <i className="fas fa-star text-yellow-400"></i>
                    <i className="fas fa-star text-yellow-400"></i>
                    <i className="fas fa-star text-yellow-400"></i>
                  </div>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">"The speaking simulator was a game-changer. I practiced daily and got Band 8 in Speaking!"</p>
              <div className="bg-green-50 dark:bg-green-900 px-3 py-2 rounded inline-block">
                <span className="text-green-600 dark:text-green-400 text-sm font-medium">General Training</span>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                  <img src="https://randomuser.me/api/portraits/women/68.jpg" alt="User" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="font-semibold dark:text-white">Maria S.</h4>
                  <div className="flex">
                    <i className="fas fa-star text-yellow-400"></i>
                    <i className="fas fa-star text-yellow-400"></i>
                    <i className="fas fa-star text-yellow-400"></i>
                    <i className="fas fa-star text-yellow-400"></i>
                    <i className="fas fa-star text-yellow-400"></i>
                  </div>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">"The personalized study plan helped me focus on my weak areas. Achieved overall Band 8!"</p>
              <div className="bg-purple-50 dark:bg-purple-900 px-3 py-2 rounded inline-block">
                <span className="text-purple-600 dark:text-purple-400 text-sm font-medium">Academic IELTS</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Demo Widget */}
      <section className="py-16 bg-white dark:bg-black">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-6 dark:text-white">Experience Our AI Tools</h2>
          <p className="text-center text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-12">Try our AI-powered evaluation with sample content</p>

          <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 md:p-8">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Writing Checker */}
              <div className="md:w-1/2 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                <h3 className="font-semibold text-lg mb-4 flex items-center dark:text-white">
                  <i className="fas fa-edit text-yellow-600 dark:text-yellow-400 mr-2"></i> Writing Checker
                </h3>
                <textarea
                  className="w-full h-40 p-3 border rounded-md mb-4 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="Paste your IELTS essay here..."
                >
                  The internet has revolutionized how we communicate. Some argue it has made relationships stronger, while others believe it causes isolation. In my opinion, the internet brings people together despite physical distances.
                </textarea>
                <button
                  className="w-full bg-yellow-600 hover:bg-yellow-700 text-white py-2 rounded-md font-medium"
                  onClick={analyzeWriting}
                >
                  Analyze My Writing
                </button>
              </div>

              {/* Speaking Analyzer */}
              <div className="md:w-1/2 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                <h3 className="font-semibold text-lg mb-4 flex items-center dark:text-white">
                  <i className="fas fa-microphone-alt text-purple-600 dark:text-purple-400 mr-2"></i> Speaking Analyzer
                </h3>
                <div className="bg-gray-100 dark:bg-gray-700 rounded-md p-4 mb-4 text-center">
                  <p className="text-gray-600 dark:text-gray-300 mb-3">Describe a time you helped someone</p>
                  <button
                    className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-md font-medium mb-2"
                    onClick={startSpeakingPractice}
                  >
                    <i className="fas fa-microphone mr-2"></i> Record Response
                  </button>
                  <p className="text-xs text-gray-500 dark:text-gray-400">(Sample: 45 seconds)</p>
                </div>
                <button
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-md font-medium"
                  onClick={startSpeakingPractice}
                >
                  Analyze My Speaking
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center mb-12">
            <div className="md:w-1/2 mb-6 md:mb-0">
              <h2 className="text-3xl font-bold mb-4 dark:text-white">Join Our Learning Community</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">Connect with other learners, ask questions, and join live study sessions.</p>
              <button
                className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-2 rounded-md font-medium"
                onClick={() => handleProtectedClick('/community')}
              >
                Visit Forums
              </button>
            </div>
            <div className="md:w-1/2 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
              <h3 className="font-semibold text-lg mb-4 border-b pb-2 dark:text-white dark:border-gray-700">Trending Discussion</h3>
              <h4 className="text-yellow-600 dark:text-yellow-400 font-medium mb-2">How to improve speaking fluency quickly?</h4>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">Started by Rajesh • 3K comments • Updated 2 hours ago</p>

              <div className="bg-yellow-50 dark:bg-yellow-900 border-l-4 border-yellow-400 dark:border-yellow-500 p-4 mb-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <i className="fas fa-fire text-yellow-500 dark:text-yellow-400"></i>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-yellow-700 dark:text-yellow-300">
                      <span className="font-medium">Live Study Group</span> - Writing Task 1 in 1 hour. <a href="#" className="font-medium underline">Join now</a>
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  className="flex-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 py-2 rounded-md font-medium text-sm"
                  onClick={() => handleProtectedClick('/ask-question')}
                >
                  <i className="far fa-comment-alt mr-1"></i> Ask a Question
                </button>
                <button
                  className="flex-1 bg-green-100 hover:bg-green-200 dark:bg-green-900 dark:hover:bg-green-800 text-green-700 dark:text-green-300 py-2 rounded-md font-medium text-sm"
                  onClick={() => handleProtectedClick('/study-buddies')}
                >
                  <i className="fas fa-users mr-1"></i> Find Study Buddy
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16 bg-white dark:bg-black">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-6 dark:text-white">Choose Your Plan</h2>
          <p className="text-center text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-12">Start with a 7-day free trial. No credit card required.</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free Tier */}
            <div className="border dark:border-gray-800 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
              <div className="p-6 border-b dark:border-gray-800">
                <h3 className="text-xl font-semibold mb-1 dark:text-white">Free</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">Basic access to get started</p>
                <div className="flex items-end mb-4">
                  <span className="text-3xl font-bold dark:text-white">$0</span>
                  <span className="text-gray-500 dark:text-gray-400 ml-1">/forever</span>
                </div>
                <button
                  className="w-full bg-gray-200 dark:bg-gray-800 text-gray-500 dark:text-gray-400 py-2 rounded-md font-medium"
                  disabled
                >
                  Get Started
                </button>
              </div>
              <div className="p-6">
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <i className="fas fa-check text-green-500 mt-1 mr-2"></i>
                    <span className="dark:text-gray-300">1 Full Mock Test</span>
                  </li>
                  <li className="flex items-start">
                    <i className="fas fa-check text-green-500 mt-1 mr-2"></i>
                    <span className="dark:text-gray-300">Basic Writing Feedback</span>
                  </li>
                  <li className="flex items-start">
                    <i className="fas fa-check text-green-500 mt-1 mr-2"></i>
                    <span className="dark:text-gray-300">Grammar Lessons</span>
                  </li>
                  <li className="flex items-start text-gray-400 dark:text-gray-500">
                    <i className="fas fa-times mt-1 mr-2"></i>
                    <span>No Speaking Evaluation</span>
                  </li>
                  <li className="flex items-start text-gray-400 dark:text-gray-500">
                    <i className="fas fa-times mt-1 mr-2"></i>
                    <span>No Teacher Review</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Premium Tier */}
            <div className="border-2 border-yellow-600 rounded-lg overflow-hidden hover:shadow-lg transition-shadow transform scale-105">
              <div className="bg-yellow-600 text-white p-3 text-center text-sm font-medium">
                MOST POPULAR
              </div>
              <div className="p-6 border-b dark:border-gray-800">
                <h3 className="text-xl font-semibold mb-1 dark:text-white">Premium</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">For serious IELTS candidates</p>
                <div className="flex items-end mb-4">
                  <span className="text-3xl font-bold dark:text-white">$19</span>
                  <span className="text-gray-500 dark:text-gray-400 ml-1">/month</span>
                </div>
                <button
                  className="w-full bg-yellow-600 hover:bg-yellow-700 text-white py-2 rounded-md font-medium"
                  onClick={() => router.push('/pricing')}
                >
                  Start Free Trial
                </button>
              </div>
              <div className="p-6">
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <i className="fas fa-check text-green-500 mt-1 mr-2"></i>
                    <span className="dark:text-gray-300">10 Full Mock Tests</span>
                  </li>
                  <li className="flex items-start">
                    <i className="fas fa-check text-green-500 mt-1 mr-2"></i>
                    <span className="dark:text-gray-300">Detailed Writing Feedback</span>
                  </li>
                  <li className="flex items-start">
                    <i className="fas fa-check text-green-500 mt-1 mr-2"></i>
                    <span className="dark:text-gray-300">Speaking Evaluation (5/month)</span>
                  </li>
                  <li className="flex items-start">
                    <i className="fas fa-check text-green-500 mt-1 mr-2"></i>
                    <span className="dark:text-gray-300">All Lessons & Strategies</span>
                  </li>
                  <li className="flex items-start text-gray-400 dark:text-gray-500">
                    <i className="fas fa-times mt-1 mr-2"></i>
                    <span>No Teacher Review</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Pro Tier */}
            <div className="border dark:border-gray-800 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
              <div className="p-6 border-b dark:border-gray-800">
                <h3 className="text-xl font-semibold mb-1 dark:text-white">Pro</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">For fastest band improvement</p>
                <div className="flex items-end mb-4">
                  <span className="text-3xl font-bold dark:text-white">$49</span>
                  <span className="text-gray-500 dark:text-gray-400 ml-1">/month</span>
                </div>
                <button
                  className="w-full bg-gray-800 hover:bg-gray-900 text-white py-2 rounded-md font-medium"
                  onClick={() => router.push('/pricing')}
                >
                  Start Free Trial
                </button>
              </div>
              <div className="p-6">
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <i className="fas fa-check text-green-500 mt-1 mr-2"></i>
                    <span className="dark:text-gray-300">Unlimited Mock Tests</span>
                  </li>
                  <li className="flex items-start">
                    <i className="fas fa-check text-green-500 mt-1 mr-2"></i>
                    <span className="dark:text-gray-300">Priority Writing Feedback</span>
                  </li>
                  <li className="flex items-start">
                    <i className="fas fa-check text-green-500 mt-1 mr-2"></i>
                    <span className="dark:text-gray-300">Unlimited Speaking Evaluation</span>
                  </li>
                  <li className="flex items-start">
                    <i className="fas fa-check text-green-500 mt-1 mr-2"></i>
                    <span className="dark:text-gray-300">2 Teacher Reviews/month</span>
                  </li>
                  <li className="flex items-start">
                    <i className="fas fa-check text-green-500 mt-1 mr-2"></i>
                    <span className="dark:text-gray-300">Personalized Study Plan</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}