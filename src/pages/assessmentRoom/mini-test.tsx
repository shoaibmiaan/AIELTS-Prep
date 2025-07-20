import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

export default function MiniTestPage() {
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
  const [currentSection, setCurrentSection] = useState<'intro' | 'listening' | 'reading' | 'writing' | 'speaking' | 'results'>('intro');
  const [answers, setAnswers] = useState({
    listening: Array(5).fill(''),
    reading: Array(5).fill(''),
    writing: '',
    speaking: ''
  });
  const [recording, setRecording] = useState(false);
  const [score, setScore] = useState<number | null>(null);

  // Timer effect
  useEffect(() => {
    if (currentSection !== 'intro' && currentSection !== 'results' && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setCurrentSection('results');
    }
  }, [timeLeft, currentSection]);

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const startTest = () => {
    setTimeLeft(600); // Reset timer
    setCurrentSection('listening');
  };

  const handleAnswerChange = (section: 'listening' | 'reading' | 'writing' | 'speaking', index: number, value: string) => {
    if (section === 'listening' || section === 'reading') {
      const newAnswers = [...answers[section]];
      newAnswers[index] = value;
      setAnswers({ ...answers, [section]: newAnswers });
    } else {
      setAnswers({ ...answers, [section]: value });
    }
  };

  const submitTest = () => {
    // Calculate a mock score (in a real app, this would be server-side)
    const listeningScore = answers.listening.filter(a => a).length * 0.5;
    const readingScore = answers.reading.filter(a => a).length * 0.5;
    const total = Math.min(9, (listeningScore + readingScore) / 2 + 4.5); // Mock calculation
    setScore(total);
    setCurrentSection('results');
  };

  const toggleRecording = () => {
    setRecording(!recording);
    // In a real app, integrate with Web Audio API for actual recording
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Head>
        <title>Mini Test - IELTS Master</title>
      </Head>

      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm py-4 px-6 flex justify-between items-center">
        <button
          onClick={() => router.push('/assessmentRoom')}
          className="flex items-center text-yellow-600 dark:text-yellow-400"
        >
          <i className="fas fa-arrow-left mr-2"></i> Back
        </button>
        <div className="text-xl font-bold">IELTS Mini Test</div>
        <div className="font-mono bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded">
          {formatTime(timeLeft)}
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {currentSection === 'intro' && (
          <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
            <h1 className="text-3xl font-bold mb-6">10-Minute Mini Test</h1>
            <p className="mb-6 text-lg">
              This quick test includes samples from all four IELTS modules. You'll have 10 minutes to complete:
            </p>
            <ul className="mb-8 text-left space-y-3">
              <li className="flex items-center">
                <i className="fas fa-headphones text-blue-500 mr-3"></i>
                <span>5 Listening questions (2 minutes)</span>
              </li>
              <li className="flex items-center">
                <i className="fas fa-book-open text-green-500 mr-3"></i>
                <span>5 Reading questions (3 minutes)</span>
              </li>
              <li className="flex items-center">
                <i className="fas fa-edit text-yellow-500 mr-3"></i>
                <span>1 Writing task (3 minutes)</span>
              </li>
              <li className="flex items-center">
                <i className="fas fa-microphone-alt text-purple-500 mr-3"></i>
                <span>1 Speaking question (2 minutes)</span>
              </li>
            </ul>
            <button
              onClick={startTest}
              className="bg-yellow-600 hover:bg-yellow-700 text-white px-8 py-3 rounded-lg font-bold text-lg"
            >
              Start Test
            </button>
          </div>
        )}

        {/* Listening Section */}
        {currentSection === 'listening' && (
          <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold flex items-center">
                <i className="fas fa-headphones text-blue-500 mr-3"></i>
                Listening
              </h2>
              <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded">
                Questions 1-5
              </span>
            </div>

            <div className="mb-6 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <p className="mb-4 italic">Listen to the recording and answer the questions below.</p>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center">
                <i className="fas fa-play mr-2"></i> Play Recording
              </button>
            </div>

            <div className="space-y-6">
              {[1, 2, 3, 4, 5].map((q) => (
                <div key={q} className="border-b dark:border-gray-700 pb-4">
                  <p className="font-medium mb-2">Question {q}: What is the main topic discussed?</p>
                  <input
                    type="text"
                    value={answers.listening[q-1]}
                    onChange={(e) => handleAnswerChange('listening', q-1, e.target.value)}
                    className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                    placeholder="Your answer..."
                  />
                </div>
              ))}
            </div>

            <div className="mt-8 flex justify-between">
              <button
                onClick={() => setCurrentSection('intro')}
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              >
                <i className="fas fa-arrow-left mr-2"></i> Back
              </button>
              <button
                onClick={() => setCurrentSection('reading')}
                className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-2 rounded"
              >
                Next Section <i className="fas fa-arrow-right ml-2"></i>
              </button>
            </div>
          </div>
        )}

        {/* Reading Section */}
        {currentSection === 'reading' && (
          <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold flex items-center">
                <i className="fas fa-book-open text-green-500 mr-3"></i>
                Reading
              </h2>
              <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-3 py-1 rounded">
                Questions 6-10
              </span>
            </div>

            <div className="mb-6 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <h3 className="font-bold mb-2">The Future of Renewable Energy</h3>
              <p className="mb-2">
                Renewable energy sources are becoming increasingly important as the world seeks to reduce its carbon footprint...
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">[Full passage would appear here in a real test]</p>
            </div>

            <div className="space-y-6">
              {[1, 2, 3, 4, 5].map((q) => (
                <div key={q} className="border-b dark:border-gray-700 pb-4">
                  <p className="font-medium mb-2">Question {q+5}: According to the passage, what is the primary benefit of solar energy?</p>
                  <select
                    value={answers.reading[q-1]}
                    onChange={(e) => handleAnswerChange('reading', q-1, e.target.value)}
                    className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                  >
                    <option value="">Select an answer</option>
                    <option value="A">Cost efficiency</option>
                    <option value="B">Environmental impact</option>
                    <option value="C">Energy storage</option>
                    <option value="D">Global availability</option>
                  </select>
                </div>
              ))}
            </div>

            <div className="mt-8 flex justify-between">
              <button
                onClick={() => setCurrentSection('listening')}
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              >
                <i className="fas fa-arrow-left mr-2"></i> Previous
              </button>
              <button
                onClick={() => setCurrentSection('writing')}
                className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-2 rounded"
              >
                Next Section <i className="fas fa-arrow-right ml-2"></i>
              </button>
            </div>
          </div>
        )}

        {/* Writing Section */}
        {currentSection === 'writing' && (
          <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold flex items-center">
                <i className="fas fa-edit text-yellow-500 mr-3"></i>
                Writing
              </h2>
              <span className="bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 px-3 py-1 rounded">
                Task 1
              </span>
            </div>

            <div className="mb-6 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <h3 className="font-bold mb-2">Writing Task 1</h3>
              <p>
                The chart below shows the percentage of households in owned and rented accommodation in England between 1918 and 2011.
                Summarize the information by selecting and reporting the main features, and make comparisons where relevant.
              </p>
              <div className="mt-4 bg-white dark:bg-gray-800 p-4 border dark:border-gray-700 rounded">
                <p className="text-center text-gray-500 dark:text-gray-400 italic">[Chart would appear here]</p>
              </div>
            </div>

            <div className="mb-4">
              <label className="block font-medium mb-2">Your Response (minimum 150 words)</label>
              <textarea
                value={answers.writing}
                onChange={(e) => handleAnswerChange('writing', 0, e.target.value)}
                className="w-full h-64 px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                placeholder="Write your response here..."
              />
              <div className="text-right text-sm text-gray-500 dark:text-gray-400 mt-1">
                Word count: {answers.writing.split(/\s+/).filter(Boolean).length}
              </div>
            </div>

            <div className="mt-8 flex justify-between">
              <button
                onClick={() => setCurrentSection('reading')}
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              >
                <i className="fas fa-arrow-left mr-2"></i> Previous
              </button>
              <button
                onClick={() => setCurrentSection('speaking')}
                className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-2 rounded"
              >
                Next Section <i className="fas fa-arrow-right ml-2"></i>
              </button>
            </div>
          </div>
        )}

        {/* Speaking Section */}
        {currentSection === 'speaking' && (
          <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold flex items-center">
                <i className="fas fa-microphone-alt text-purple-500 mr-3"></i>
                Speaking
              </h2>
              <span className="bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-3 py-1 rounded">
                Part 2
              </span>
            </div>

            <div className="mb-6 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <h3 className="font-bold mb-2">Speaking Task</h3>
              <p>
                Describe a time when you had to learn something new. You should say:
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>what you had to learn</li>
                  <li>why you needed to learn it</li>
                  <li>how you went about learning it</li>
                  <li>and explain how you felt about this experience</li>
                </ul>
              </p>
              <p className="mt-3">You will have 1 minute to prepare and 2 minutes to speak.</p>
            </div>

            <div className="mb-6">
              <div className="flex items-center justify-center mb-4">
                <button
                  onClick={toggleRecording}
                  className={`flex items-center justify-center w-16 h-16 rounded-full ${recording ? 'bg-red-600' : 'bg-purple-600'} text-white`}
                >
                  <i className={`fas ${recording ? 'fa-stop' : 'fa-microphone'} text-xl`}></i>
                </button>
              </div>
              <p className="text-center text-gray-600 dark:text-gray-300">
                {recording ? 'Recording... Speak now' : 'Click the microphone to start recording'}
              </p>
            </div>

            <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg mb-6">
              <h4 className="font-medium mb-2">Your Response</h4>
              {answers.speaking ? (
                <p className="italic">{answers.speaking}</p>
              ) : (
                <p className="text-gray-500 dark:text-gray-400 italic">
                  {recording ? 'Your speech will appear here...' : 'No recording yet'}
                </p>
              )}
            </div>

            <div className="mt-8 flex justify-between">
              <button
                onClick={() => setCurrentSection('writing')}
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              >
                <i className="fas fa-arrow-left mr-2"></i> Previous
              </button>
              <button
                onClick={submitTest}
                className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-2 rounded"
              >
                Submit Test <i className="fas fa-check ml-2"></i>
              </button>
            </div>
          </div>
        )}

        {/* Results Section */}
        {currentSection === 'results' && (
          <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
            <h1 className="text-3xl font-bold mb-6">Test Results</h1>

            <div className="mb-8">
              <div className="w-32 h-32 mx-auto rounded-full bg-yellow-100 dark:bg-yellow-900 flex items-center justify-center mb-4">
                <span className="text-4xl font-bold text-yellow-600 dark:text-yellow-400">
                  {score?.toFixed(1)}
                </span>
              </div>
              <p className="text-xl">Overall Band Score</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 text-left">
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <h3 className="font-bold mb-3 flex items-center">
                  <i className="fas fa-headphones text-blue-500 mr-2"></i>
                  Listening
                </h3>
                <p>Correct answers: {answers.listening.filter(a => a).length}/5</p>
                <p>Estimated score: {(answers.listening.filter(a => a).length * 0.5 + 4).toFixed(1)}</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <h3 className="font-bold mb-3 flex items-center">
                  <i className="fas fa-book-open text-green-500 mr-2"></i>
                  Reading
                </h3>
                <p>Correct answers: {answers.reading.filter(a => a).length}/5</p>
                <p>Estimated score: {(answers.reading.filter(a => a).length * 0.5 + 4).toFixed(1)}</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <h3 className="font-bold mb-3 flex items-center">
                  <i className="fas fa-edit text-yellow-500 mr-2"></i>
                  Writing
                </h3>
                <p>Word count: {answers.writing.split(/\s+/).filter(Boolean).length}</p>
                <p>Estimated score: {score ? (score - 0.5).toFixed(1) : 'N/A'}</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <h3 className="font-bold mb-3 flex items-center">
                  <i className="fas fa-microphone-alt text-purple-500 mr-2"></i>
                  Speaking
                </h3>
                <p>Response: {answers.speaking ? 'Submitted' : 'Not completed'}</p>
                <p>Estimated score: {score ? (score - 0.5).toFixed(1) : 'N/A'}</p>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-bold mb-4">Feedback</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {score && score >= 7.5 ? 'Excellent work! You show strong English proficiency.' :
                 score && score >= 6.5 ? 'Good job! With some more practice you can improve further.' :
                 'Keep practicing! Focus on your weak areas to see improvement.'}
              </p>
              <button className="text-yellow-600 dark:text-yellow-400 font-medium">
                View detailed feedback <i className="fas fa-arrow-right ml-1"></i>
              </button>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button
                onClick={() => router.push('/assessmentRoom')}
                className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 px-6 py-3 rounded-lg font-medium"
              >
                Back to Practice
              </button>
              <button
                onClick={() => router.push('/premium-dashboard')}
                className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-3 rounded-lg font-medium"
              >
                Go Premium for Full Tests
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}