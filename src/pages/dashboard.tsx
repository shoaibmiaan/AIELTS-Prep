'use client';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, BookOpen, Headphones, Mic, Pencil, Rocket, BarChart, Award, Clock, Sun, Moon } from 'lucide-react';

// Particle effect component
const ParticleBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;

    // Set canvas size
    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);

    // Particle system
    const particles = [];
    const particleCount = 150;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 3 + 1,
        color: `rgba(255, ${Math.floor(Math.random() * 100) + 155}, ${Math.floor(Math.random() * 100) + 155}, ${Math.random() * 0.3 + 0.1})`,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw particles
      for (const particle of particles) {
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.fill();

        // Update position
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        // Bounce off edges
        if (particle.x < 0 || particle.x > canvas.width) particle.speedX = -particle.speedX;
        if (particle.y < 0 || particle.y > canvas.height) particle.speedY = -particle.speedY;
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', setCanvasSize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full z-0 pointer-events-none"
    />
  );
};

// Glassmorphism card component
const GlassCard = ({ children, className = '' }) => (
  <motion.div
    className={`bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 shadow-2xl ${className}`}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ scale: 1.02 }}
    transition={{ duration: 0.3 }}
  >
    {children}
  </motion.div>
);

// Progress ring component
const ProgressRing = ({ progress, color, size = 80 }) => {
  const radius = size / 2 - 5;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="w-full h-full transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="6"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="6"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-lg">
        {Math.round(progress)}%
      </div>
    </div>
  );
};

// Skill card component
const SkillCard = ({ title, level, color }) => (
  <motion.div
    className="flex items-center p-4 bg-white/5 rounded-xl backdrop-blur-sm border border-white/10"
    whileHover={{ y: -5 }}
    transition={{ duration: 0.2 }}
  >
    <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center mr-4">
      <div className="w-8 h-8 rounded-full" style={{ background: color }} />
    </div>
    <div className="flex-1">
      <h3 className="text-white font-medium">{title}</h3>
      <div className="w-full h-2 bg-white/10 rounded-full mt-2 overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ background: color }}
          initial={{ width: 0 }}
          animate={{ width: `${level}%` }}
          transition={{ duration: 1, delay: 0.3 }}
        />
      </div>
    </div>
    <div className="text-white font-bold ml-2">{level}%</div>
  </motion.div>
);

// Main dashboard component
export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [expandedSection, setExpandedSection] = useState('assessment');
  const [theme, setTheme] = useState('dark');
  const [bandScores, setBandScores] = useState({
    Reading: 6.5,
    Listening: 7.0,
    Speaking: 6.0,
    Writing: 6.5
  });
  const [skillData] = useState([
    { skill: 'Vocabulary', level: 75, color: '#6366f1' },
    { skill: 'Grammar', level: 65, color: '#10b981' },
    { skill: 'Fluency', level: 70, color: '#f59e0b' },
    { skill: 'Pronunciation', level: 60, color: '#8b5cf6' },
  ]);
  const [userStreak, setUserStreak] = useState(12);
  const [userGoal] = useState('Band 7+');
  const [userName] = useState('Alex Johnson');

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      {/* Animated background */}
      <ParticleBackground />

      {/* Floating elements */}
      <div className="fixed inset-0 pointer-events-none">
        <motion.div
          className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-purple-500/10 blur-3xl"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.1, 0.15, 0.1]
          }}
          transition={{
            duration: 8,
            repeat: Infinity
          }}
        />
        <motion.div
          className="absolute top-1/3 right-1/4 w-72 h-72 rounded-full bg-blue-500/10 blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            delay: 2
          }}
        />
      </div>

      {/* Dashboard content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <header className="flex justify-between items-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl font-bold">IELTS Master</h1>
            <p className="text-sm opacity-70">Advanced Preparation Platform</p>
          </motion.div>

          <div className="flex items-center gap-6">
            <motion.button
              onClick={toggleTheme}
              className={`p-2 rounded-full ${theme === 'dark' ? 'bg-white/10' : 'bg-gray-800/10'}`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </motion.button>

            <motion.div
              className="flex items-center gap-3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold">
                {userName.charAt(0)}
              </div>
              <div>
                <div className="font-medium">{userName}</div>
                <div className="text-xs opacity-70">{userGoal}</div>
              </div>
            </motion.div>
          </div>
        </header>

        {/* Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Welcome card */}
            <GlassCard>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">Welcome back, {userName}!</h2>
                    <p className="opacity-80 mb-6">Ready to continue your IELTS journey? You're making great progress!</p>

                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-500 to-yellow-500 flex items-center justify-center">
                          🔥
                        </div>
                        <div>
                          <div className="text-xs opacity-70">Current streak</div>
                          <div className="font-bold">{userStreak} days</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                          🎯
                        </div>
                        <div>
                          <div className="text-xs opacity-70">Target score</div>
                          <div className="font-bold">{userGoal}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <motion.div
                    className="relative"
                    animate={{ rotate: [0, 5, 0, -5, 0] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity
                    }}
                  >
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-r from-orange-500 to-yellow-500 flex items-center justify-center">
                      🎉
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </GlassCard>

            {/* Band scores */}
            <GlassCard>
              <h2 className="text-xl font-bold mb-6">Your Band Scores</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {Object.entries(bandScores).map(([skill, score], index) => {
                  const progress = (score / 9) * 100;
                  const colors = ['#6366f1', '#10b981', '#f59e0b', '#8b5cf6'];

                  return (
                    <motion.div
                      key={skill}
                      className="flex flex-col items-center"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                    >
                      <ProgressRing
                        progress={progress}
                        color={colors[index]}
                        size={100}
                      />
                      <h3 className="mt-3 font-medium">{skill}</h3>
                      <div className="text-2xl font-bold mt-1">{score}</div>
                    </motion.div>
                  );
                })}
              </div>
            </GlassCard>

            {/* Skills analysis */}
            <GlassCard>
              <h2 className="text-xl font-bold mb-6">Skill Analysis</h2>
              <div className="space-y-4">
                {skillData.map((skill, index) => (
                  <motion.div
                    key={skill.skill}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                  >
                    <SkillCard
                      title={skill.skill}
                      level={skill.level}
                      color={skill.color}
                    />
                  </motion.div>
                ))}
              </div>
            </GlassCard>
          </div>

          {/* Right column */}
          <div className="space-y-8">
            {/* Quick actions */}
            <GlassCard>
              <h2 className="text-xl font-bold mb-6">Quick Actions</h2>
              <div className="space-y-4">
                {[
                  {
                    icon: <Rocket size={24} />,
                    title: 'Start Test',
                    desc: 'Begin a new practice test',
                    color: 'from-purple-500 to-indigo-500'
                  },
                  {
                    icon: <BookOpen size={24} />,
                    title: 'Study Materials',
                    desc: 'Access learning resources',
                    color: 'from-blue-500 to-teal-500'
                  },
                  {
                    icon: <BarChart size={24} />,
                    title: 'Progress Report',
                    desc: 'View your performance',
                    color: 'from-green-500 to-emerald-500'
                  },
                  {
                    icon: <Award size={24} />,
                    title: 'Achievements',
                    desc: 'See your accomplishments',
                    color: 'from-yellow-500 to-orange-500'
                  },
                ].map((action, index) => (
                  <motion.div
                    key={action.title}
                    className={`p-4 rounded-xl bg-gradient-to-r ${action.color} cursor-pointer`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                        {action.icon}
                      </div>
                      <div>
                        <h3 className="font-bold">{action.title}</h3>
                        <p className="text-sm opacity-90">{action.desc}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </GlassCard>

            {/* Test modules */}
            <GlassCard>
              <h2 className="text-xl font-bold mb-6">Test Modules</h2>
              <div className="space-y-4">
                {[
                  {
                    icon: <BookOpen size={20} />,
                    title: 'Reading',
                    time: '60 min',
                    questions: 40
                  },
                  {
                    icon: <Headphones size={20} />,
                    title: 'Listening',
                    time: '30 min',
                    questions: 40
                  },
                  {
                    icon: <Mic size={20} />,
                    title: 'Speaking',
                    time: '15 min',
                    questions: 3
                  },
                  {
                    icon: <Pencil size={20} />,
                    title: 'Writing',
                    time: '60 min',
                    questions: 2
                  },
                ].map((module, index) => (
                  <motion.div
                    key={module.title}
                    className="p-4 bg-white/5 rounded-xl backdrop-blur-sm border border-white/10 flex items-center gap-4"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    whileHover={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
                  >
                    <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                      {module.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{module.title}</h3>
                    </div>
                    <div className="flex gap-2 text-sm">
                      <div className="flex items-center gap-1">
                        <Clock size={16} />
                        {module.time}
                      </div>
                      <div className="flex items-center gap-1">
                        <div>•</div>
                        {module.questions} Qs
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </GlassCard>

            {/* Daily tip */}
            <GlassCard>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-orange-500 to-yellow-500 flex items-center justify-center flex-shrink-0">
                  💡
                </div>
                <div>
                  <h2 className="text-xl font-bold mb-2">Daily Tip</h2>
                  <p className="opacity-90">
                    When taking notes during the listening test, use abbreviations and symbols to save time.
                    This will help you capture more information quickly.
                  </p>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>

        {/* Test options */}
        <motion.div
          className="mt-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <h2 className="text-2xl font-bold mb-6">Start a Test</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <GlassCard className="hover:border-purple-500/50 transition-colors">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center flex-shrink-0">
                  <BarChart size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-2">Practice Test</h3>
                  <p className="opacity-80 mb-4">
                    Take individual modules at your own pace with instant feedback and explanations
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                      <span>No time limit</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                      <span>Detailed answer explanations</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                      <span>Focus on specific skills</span>
                    </li>
                  </ul>
                </div>
              </div>
              <motion.button
                className="mt-6 w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-lg"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Start Practice Test
              </motion.button>
            </GlassCard>

            <GlassCard className="hover:border-orange-500/50 transition-colors">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-orange-500 to-yellow-500 flex items-center justify-center flex-shrink-0">
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
              <motion.button
                className="mt-6 w-full py-3 bg-gradient-to-r from-orange-600 to-yellow-600 text-white font-semibold rounded-lg"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Start Full Simulation
              </motion.button>
            </GlassCard>
          </div>
        </motion.div>
      </div>
    </div>
  );
}