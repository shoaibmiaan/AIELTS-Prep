'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';

type Stat = {
  title: string;
  value: number;
  color: string;
};

type Tool = {
  href: string;
  title: string;
  desc: string;
  emoji: string;
  bg?: string;
};

const readingTools: Tool[] = [
  { href: '/admin/reading-importer', title: 'Reading Importer (Pages Router)', desc: 'Import IELTS reading papers (legacy importer, supports JSON, CSV, PDF).', emoji: '🧾' },
  { href: '/admin/pdf-importer', title: 'Upload Reading Tests', desc: 'Import and manage IELTS reading test content.', emoji: '📘' },
  { href: '/admin/reading-library', title: 'Reading Library', desc: 'Browse and maintain your reading database.', emoji: '📚' },
  { href: '/admin/manual-upload', title: 'Manual Upload', desc: 'Manually upload test materials or custom content.', emoji: '🔼' },
  { href: '/admin/reading-reviews', title: 'Review Submissions', desc: 'View and analyze student answers in detail.', emoji: '🔍' }
];

const listeningTools: Tool[] = [
  { href: '/admin/pdf-importer', title: 'Upload Listening Tests', desc: 'Upload and manage IELTS listening tests.', emoji: '🎧' },
  { href: '/admin/listening-library', title: 'Listening Library', desc: 'View, edit, or delete listening materials.', emoji: '🎼' },
  { href: '/admin/manual-listening-upload', title: 'Manual Upload', desc: 'Upload listening files and questions manually.', emoji: '🔼' },
  { href: '/admin/listening-analytics', title: 'Listening Analytics', desc: 'Analyze user performance on listening tests.', emoji: '📊' }
];

const writingTools: Tool[] = [
  { href: '/admin/writing-upload', title: 'Upload Writing Prompts', desc: 'Upload IELTS Writing Task 1/2 prompts.', emoji: '📝' },
  { href: '/admin/writing-library', title: 'Prompt Library', desc: 'Manage saved writing prompts.', emoji: '📚' },
  { href: '/admin/writing-manual-upload', title: 'Manual Upload', desc: 'Manually upload writing exercises.', emoji: '🔼' },
  { href: '/admin/writing-feedbacks', title: 'AI Feedback Logs', desc: 'Review writing submissions and AI scores.', emoji: '🤖' }
];

const speakingTools: Tool[] = [
  { href: '/admin/speaking-prompts', title: 'Upload Speaking Prompts', desc: 'Add IELTS Speaking Part 1/2/3 prompts.', emoji: '🎤' },
  { href: '/admin/speaking-library', title: 'Audio Library', desc: 'Manage user audio responses.', emoji: '🎙️' },
  { href: '/admin/speaking-manual-upload', title: 'Manual Upload', desc: 'Upload audio/questions manually.', emoji: '🔼' },
  { href: '/admin/speaking-reviews', title: 'AI Speaking Reviews', desc: 'Review speaking answers & band predictions.', emoji: '🧠' }
];

export default function AdminDashboard() {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [stats, setStats] = useState<Stat[]>([]);

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      const { data: profile } = await supabase.from('profiles').select('role').eq('id', user?.id).single();
      if (profile?.role !== 'admin') {
        router.replace('/dashboard');
      } else {
        setIsAdmin(true);
      }
    };
    checkAdmin();
  }, [router]);

  useEffect(() => {
    const fetchStats = async () => {
      const [
        { count: totalUsers },
        { count: activeTeachers },
        { count: pendingTeachers },
        { data: activeUsersData }
      ] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'teacher'),
        supabase.from('teacher_requests').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.rpc('get_active_users_last_7_days')
      ]);

      setStats([
        { title: 'Total Users', value: totalUsers || 0, color: 'bg-blue-100 text-blue-800' },
        { title: 'Active Users (7d)', value: activeUsersData?.[0]?.count || 0, color: 'bg-green-100 text-green-800' },
        { title: 'Active Teachers', value: activeTeachers || 0, color: 'bg-indigo-100 text-indigo-800' },
        { title: 'Pending Teachers', value: pendingTeachers || 0, color: 'bg-red-100 text-red-800' }
      ]);
    };

    if (isAdmin) fetchStats();
  }, [isAdmin]);

  if (!isAdmin) return null;

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 space-y-10">
      <div className="text-sm text-gray-500 mb-2">
        <span className="text-gray-400">Admin</span> &nbsp;&gt;&nbsp; <span className="font-semibold text-gray-700">Dashboard</span>
      </div>

      <h1 className="text-3xl font-bold">🛠️ Admin Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.title} className={`${stat.color} p-5 rounded-xl`}>
            <p className="text-sm">{stat.title}</p>
            <p className="text-2xl font-semibold">{stat.value}</p>
          </div>
        ))}
      </div>

      <Section title="📘 Reading Tools" tools={readingTools} />
      <Section title="🎧 Listening Tools" tools={listeningTools} />
      <Section title="📝 Writing Tools" tools={writingTools} />
      <Section title="🎤 Speaking Tools" tools={speakingTools} />
    </div>
  );
}

function Section({ title, tools }: { title: string; tools: Tool[] }) {
  return (
    <div className="mt-16">
      <h2 className="text-2xl font-bold text-gray-900 mb-1">{title}</h2>
      <p className="text-base text-gray-500 mb-6">{title.replace('Tools', 'Module')}</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {tools.map(({ href, title, desc, emoji }) => (
          <Link
            key={href}
            href={href}
            className="group p-5 rounded-xl border border-gray-200 shadow hover:shadow-lg bg-white hover:bg-gray-50 transition"
          >
            <div className="flex items-start space-x-3">
              <div className="text-2xl pt-1">{emoji}</div>
              <div>
                <h3 className="text-sm font-semibold text-gray-800 group-hover:text-blue-600">{title}</h3>
                <p className="text-xs text-gray-600 mt-1 leading-snug">{desc}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
