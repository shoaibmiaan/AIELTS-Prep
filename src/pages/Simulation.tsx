import { useState } from 'react';
import { useRouter } from 'next/router';
import { Link } from 'next/link';  // You might need to import this depending on your setup

export default function Dashboard() {
  const [selectedModule, setSelectedModule] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const router = useRouter();

  const handleStartSimulation = () => {
    if (!selectedModule) {
      // Show a prompt asking the user to select a module
      alert('Please select a module first!');
      return;
    }

    // Start the test and show instructions while the AI prepares the test
    setIsLoading(true);
    setShowInstructions(true);

    // Simulate AI preparing the test (you would likely replace this with an API call)
    setTimeout(() => {
      // Navigate to the simulation page once the AI is ready
      router.push(`/simulation/${selectedModule}`);
    }, 3000);  // Simulating loading for 3 seconds
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Main content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-orange-500 to-yellow-500">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center">
              <Award size={24} />
            </div>
            <div>
              <h3 className="text-lg font-bold mb-2">Full Simulation</h3>
              <p className="opacity-80 mb-4">
                Experience the complete IELTS test under timed conditions with realistic scoring
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                  <span>Timed test conditions</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                  <span>Full 4-module test</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                  <span>Official band score prediction</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-500 to-teal-500">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-teal-500 flex items-center justify-center">
              <BarChart size={24} />
            </div>
            <div>
              <h3 className="text-lg font-bold mb-2">Select Module</h3>
              <select
                value={selectedModule}
                onChange={(e) => setSelectedModule(e.target.value)}
                className="border rounded-md p-2"
              >
                <option value="">-- Select a module --</option>
                <option value="reading">Reading</option>
                <option value="listening">Listening</option>
                <option value="speaking">Speaking</option>
                <option value="writing">Writing</option>
              </select>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <motion.button
            onClick={handleStartSimulation}
            className="w-full py-3 bg-gradient-to-r from-orange-600 to-yellow-600 text-white font-semibold rounded-lg"
          >
            Start Full Simulation
          </motion.button>
        </div>

        {/* Display instructions while the test is loading */}
        {showInstructions && isLoading && (
          <div className="mt-8 p-4 bg-gray-200 rounded-md">
            <h2 className="text-xl font-bold">Test Instructions</h2>
            <p className="mt-2">Your full IELTS simulation test is being prepared. Please wait...</p>
            <div className="mt-4 text-center">
              <p>While waiting for the AI to prepare the test, here are some useful tips:</p>
              <ul className="list-disc ml-6 mt-2">
                <li>Stay calm and focus during the test.</li>
                <li>Read the instructions carefully before starting each section.</li>
                <li>Practice time management to complete all sections within the given time.</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
