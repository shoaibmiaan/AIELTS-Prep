'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faMicrophoneAlt, faClock, faChartLine } from '@fortawesome/free-solid-svg-icons';
import { faClock as faClockRegular } from '@fortawesome/free-regular-svg-icons';
import { colors, fonts, fontSizes, spacing, borderRadius, shadows, containers, gridLayouts } from '../styles/globalStyles';

interface UserProgress {
  writing: number;
  listening: number;
  speaking: number;
  reading: number;
  overall: number;
  targetBand: number;
}

interface IELTSFeaturesProps {
  darkMode: boolean;
  handleProtectedClick: (route: string) => void;
  startMockTest: () => void;
  analyzeWriting: () => void;
  startSpeakingPractice: () => void;
  userProgress: UserProgress;
}

export default function IELTSFeatures({
  darkMode,
  handleProtectedClick,
  startMockTest,
  analyzeWriting,
  startSpeakingPractice,
  userProgress,
}: IELTSFeaturesProps) {
  const router = useRouter();

  return (
    <>
      {/* Features Section */}
      <section className={`py-8 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="max-w-7xl mx-auto px-6">
          <h2 className={`text-3xl font-bold text-center mb-12 ${darkMode ? 'text-white' : 'text-black'}`}>
            Your Complete IELTS Toolkit
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 - AI Writing Evaluator */}
            <div className={`feature-card ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'} p-6 rounded-xl shadow-md border transition-all duration-300`}>
              <div className={`w-14 h-14 ${darkMode ? 'bg-yellow-900' : 'bg-yellow-100'} rounded-full flex items-center justify-center mb-4`}>
                <FontAwesomeIcon icon={faEdit} className={`${darkMode ? 'text-yellow-400' : 'text-yellow-600'} text-2xl`} />
              </div>
              <h3 className={`text-xl font-semibold mb-3 ${darkMode ? 'text-white' : 'text-black'}`}>
                AI Writing Evaluator
              </h3>
              <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Get band-specific feedback on your essays with detailed corrections.</p>
              <button
                onClick={analyzeWriting}
                className={`mt-4 inline-block ${darkMode ? 'text-yellow-400' : 'text-yellow-600'} font-medium`}
              >
                Try Now →
              </button>
            </div>

            {/* Feature 2 - Speaking Simulator */}
            <div className={`feature-card ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'} p-6 rounded-xl shadow-md border transition-all duration-300`}>
              <div className={`w-14 h-14 ${darkMode ? 'bg-purple-900' : 'bg-purple-100'} rounded-full flex items-center justify-center mb-4`}>
                <FontAwesomeIcon icon={faMicrophoneAlt} className={`${darkMode ? 'text-purple-400' : 'text-purple-600'} text-2xl`} />
              </div>
              <h3 className={`text-xl font-semibold mb-3 ${darkMode ? 'text-white' : 'text-black'}`}>
                Speaking Simulator
              </h3>
              <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Practice with AI partners in UK/US/AUS accents and get instant feedback.</p>
              <button
                onClick={startSpeakingPractice}
                className={`mt-4 inline-block ${darkMode ? 'text-purple-400' : 'text-purple-600'} font-medium`}
              >
                Start Practice →
              </button>
            </div>

            {/* Feature 3 - Full Mock Tests */}
            <div className={`feature-card ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'} p-6 rounded-xl shadow-md border transition-all duration-300`}>
              <div className={`w-14 h-14 ${darkMode ? 'bg-green-900' : 'bg-green-100'} rounded-full flex items-center justify-center mb-4`}>
                <FontAwesomeIcon icon={faClock} className={`${darkMode ? 'text-green-400' : 'text-green-600'} text-2xl`} />
              </div>
              <h3 className={`text-xl font-semibold mb-3 ${darkMode ? 'text-white' : 'text-black'}`}>
                Full Mock Tests
              </h3>
              <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Timed tests with real band score predictions for all four modules.</p>
              <button
                onClick={startMockTest}
                className={`mt-4 inline-block ${darkMode ? 'text-green-400' : 'text-green-600'} font-medium`}
              >
                Take Test →
              </button>
            </div>

            {/* Feature 4 - Progress Analytics */}
            <div className={`feature-card ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'} p-6 rounded-xl shadow-md border transition-all duration-300`}>
              <div className={`w-14 h-14 ${darkMode ? 'bg-orange-900' : 'bg-orange-100'} rounded-full flex items-center justify-center mb-4`}>
                <FontAwesomeIcon icon={faChartLine} className={`${darkMode ? 'text-orange-400' : 'text-orange-600'} text-2xl`} />
              </div>
              <h3 className={`text-xl font-semibold mb-3 ${darkMode ? 'text-white' : 'text-black'}`}>
                Progress Analytics
              </h3>
              <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Track your weaknesses and improvements with detailed reports.</p>
              <button
                onClick={() => handleProtectedClick('/progress')}
                className={`mt-4 inline-block ${darkMode ? 'text-orange-400' : 'text-orange-600'} font-medium`}
              >
                View Dashboard →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Learning Module Preview */}
      <section className={`py-8 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="max-w-7xl mx-auto px-6">
          <h2 className={`text-3xl font-bold text-center mb-6 ${darkMode ? 'text-white' : 'text-black'}`}>
            Structured Learning Paths
          </h2>
          <p className={`text-center ${darkMode ? 'text-gray-300' : 'text-gray-600'} max-w-2xl mx-auto mb-12`}>
            Progress through carefully designed courses tailored to your target band score.
          </p>

          <div className="flex justify-center mb-8">
            <div className="inline-flex rounded-md shadow-sm">
              <button className="px-4 py-2 text-sm font-medium rounded-l-lg bg-yellow-600 text-white">
                Academic
              </button>
              <button className={`px-4 py-2 text-sm font-medium ${darkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>
                General Training
              </button>
              <button className={`px-4 py-2 text-sm font-medium rounded-r-lg ${darkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>
                Beginner to Advanced
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Lesson 1 */}
            <div className={`border ${darkMode ? 'border-gray-800' : ''} rounded-lg overflow-hidden hover:shadow-lg transition-shadow`}>
              <div className="p-5">
                <div className="flex justify-between mb-3">
                  <span className={`text-sm font-medium ${darkMode ? 'text-yellow-400 bg-yellow-900' : 'text-yellow-600 bg-yellow-50'} px-2 py-1 rounded`}>Grammar</span>
                  <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{userProgress.writing}%</span>
                </div>
                <h3 className={`font-semibold text-lg mb-2 ${darkMode ? 'text-white' : 'text-black'}`}>
                  Complex Sentences
                </h3>
                <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-4`}>
                  Master compound-complex structures for Band 7+ writing.
                </p>
                <div className={`w-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full h-2`}>
                  <div
                    className="bg-yellow-600 h-2 rounded-full"
                    style={{ width: `${userProgress.writing}%` }}
                  ></div>
                </div>
              </div>
              <div className={`bg-${darkMode ? 'gray-900' : 'gray-50'} px-5 py-3 border-t ${darkMode ? 'border-gray-800' : ''} flex justify-between items-center`}>
                <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}><FontAwesomeIcon icon={faClockRegular} className="mr-1" /> 25 min</span>
                <button
                  className={`text-sm ${darkMode ? 'text-yellow-400' : 'text-yellow-600'} font-medium`}
                  onClick={() => handleProtectedClick('/complex-sentences')}
                >
                  Continue
                </button>
              </div>
            </div>

            {/* Lesson 2 */}
            <div className={`border ${darkMode ? 'border-gray-800' : ''} rounded-lg overflow-hidden hover:shadow-lg transition-shadow`}>
              <div className="p-5">
                <div className="flex justify-between mb-3">
                  <span className={`text-sm font-medium ${darkMode ? 'text-purple-400 bg-purple-900' : 'text-purple-600 bg-purple-100'} px-2 py-1 rounded`}>Listening</span>
                  <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {userProgress.listening > 0 ? `${userProgress.listening}%` : 'Locked'}
                  </span>
                </div>
                <h3 className={`font-semibold text-lg mb-2 ${darkMode ? 'text-white' : 'text-black'}`}>
                  Map Labelling
                </h3>
                <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-4`}>
                  Strategies for Section 2 map-based questions.
                </p>
                <div className={`w-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full h-2`}>
                  <div
                    className={`${userProgress.listening > 0 ? 'bg-purple-600' : darkMode ? 'bg-gray-700' : 'bg-gray-200'} h-2 rounded-full`}
                    style={{ width: `${userProgress.listening}%` }}
                  ></div>
                </div>
              </div>
              <div className={`bg-${darkMode ? 'gray-900' : 'gray-50'} px-5 py-3 border-t ${darkMode ? 'border-gray-800' : ''} flex justify-between items-center`}>
                <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}><FontAwesomeIcon icon={faClockRegular} className="mr-1" /> 35 min</span>
                {userProgress.listening > 0 ? (
                  <button
                    className={`text-sm ${darkMode ? 'text-purple-400' : 'text-purple-600'} font-medium`}
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
            <div className={`border ${darkMode ? 'border-gray-800' : ''} rounded-lg overflow-hidden hover:shadow-lg transition-shadow`}>
              <div className="p-5">
                <div className="flex justify-between mb-3">
                  <span className={`text-sm font-medium ${darkMode ? 'text-green-400 bg-green-900' : 'text-green-600 bg-green-100'} px-2 py-1 rounded`}>Speaking</span>
                  <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {userProgress.speaking > 0 ? `${userProgress.speaking}%` : '0%'}
                  </span>
                </div>
                <h3 className={`font-semibold text-lg mb-2 ${darkMode ? 'text-white' : 'text-black'}`}>
                  Part 3 Strategies
                </h3>
                <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-4`}>
                  Develop extended answers for abstract questions.
                </p>
                <div className={`w-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full h-2`}>
                  <div
                    className="bg-green-600 h-2 rounded-full"
                    style={{ width: `${userProgress.speaking}%` }}
                  ></div>
                </div>
              </div>
              <div className={`bg-${darkMode ? 'gray-900' : 'gray-50'} px-5 py-3 border-t ${darkMode ? 'border-gray-800' : ''} flex justify-between items-center`}>
                <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}><FontAwesomeIcon icon={faClockRegular} className="mr-1" /> 45 min</span>
                <button
                  className={`text-sm ${darkMode ? 'text-green-400' : 'text-green-600'} font-medium`}
                  onClick={() => handleProtectedClick('/speaking-part3')}
                >
                  {userProgress.speaking > 0 ? 'Continue' : 'Start'}
                </button>
              </div>
            </div>
          </div>

          <div className="text-center mt-10">
            <button
              className={`px-6 py-2 border ${darkMode ? 'border-yellow-400 text-yellow-400' : 'border-yellow-600 text-yellow-600'} rounded-md font-medium hover:${darkMode ? 'bg-gray-800' : 'bg-yellow-50'}`}
              onClick={() => handleProtectedClick('/courses')}
            >
              View All Courses
            </button>
          </div>
        </div>
      </section>

      {/* AI Demo Widget */}
      <section className={`py-8 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="max-w-7xl mx-auto px-6">
          <h2 className={`text-3xl font-bold text-center mb-6 ${darkMode ? 'text-white' : 'text-black'}`}>
            Experience Our AI Tools
          </h2>
          <p className={`text-center ${darkMode ? 'text-gray-300' : 'text-gray-600'} max-w-2xl mx-auto mb-12`}>
            Try our AI-powered evaluation with sample content
          </p>

          <div className={`bg-${darkMode ? 'gray-900' : 'gray-50'} rounded-xl p-6 md:p-8`}>
            <div className="flex flex-col md:flex-row gap-6">
              {/* Writing Checker */}
              <div className={`md:w-1/2 ${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-sm`}>
                <h3 className={`font-semibold text-lg mb-4 flex items-center ${darkMode ? 'text-white' : 'text-black'}`}>
                  <FontAwesomeIcon icon={faEdit} className={`${darkMode ? 'text-yellow-400' : 'text-yellow-600'} mr-2`} /> Writing Checker
                </h3>
                <textarea
                  className={`w-full h-40 p-3 border rounded-md mb-4 ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300 text-black'}`}
                  placeholder="Paste your IELTS essay here..."
                  defaultValue="The internet has revolutionized how we communicate. Some argue it has made relationships stronger, while others believe it causes isolation. In my opinion, the internet brings people together despite physical distances."
                />
                <button
                  className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-md font-medium w-full"
                  onClick={analyzeWriting}
                >
                  Analyze My Writing
                </button>
              </div>

              {/* Speaking Analyzer */}
              <div className={`md:w-1/2 ${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-sm`}>
                <h3 className={`font-semibold text-lg mb-4 flex items-center ${darkMode ? 'text-white' : 'text-black'}`}>
                  <FontAwesomeIcon icon={faMicrophoneAlt} className={`${darkMode ? 'text-purple-400' : 'text-purple-600'} mr-2`} /> Speaking Analyzer
                </h3>
                <div className={`bg-${darkMode ? 'gray-700' : 'gray-100'} rounded-md p-4 mb-4 text-center`}>
                  <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-3`}>Describe a time you helped someone</p>
                  <button
                    className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-md font-medium mb-2"
                    onClick={startSpeakingPractice}
                  >
                    <FontAwesomeIcon icon={faMicrophoneAlt} className="mr-2" /> Record Response
                  </button>
                  <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>(Sample: 45 seconds)</p>
                </div>
                <button
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md font-medium w-full"
                  onClick={startSpeakingPractice}
                >
                  Analyze My Speaking
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}