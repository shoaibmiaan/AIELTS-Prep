'use client';

import React, { ReactNode, useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { supabase } from '@/lib/supabaseClient';
import { Home, Headphones, BookOpen, Edit3, Mic, Activity, LogOut } from 'lucide-react';
import Avatar from '@/components/Avatar';
import SubscribeForm from '@/components/SubscribeForm';
import Breadcrumb from '@/components/Breadcrumb';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: Home },
  { href: '/practice/listening', label: 'Listening', icon: Headphones },
  { href: '/practice/reading', label: 'Reading', icon: BookOpen },
  { href: '/practice/writing/writing-instructions', label: 'Writing', icon: Edit3 },
  { href: '/practice/speaking/speaking', label: 'Speaking', icon: Mic },
  { href: '/exercises', label: 'Exercises', icon: Activity },
];

type Profile = { role: string; full_name: string; avatar_url?: string };

export default function Layout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [role, setRole] = useState('');
  const [loading, setLoading] = useState(true);
  const [collapsed, setCollapsed] = useState<boolean | null>(null);
  const [pendingRequests, setPendingRequests] = useState(0);

  const loadProfile = useCallback(async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return router.replace('/login');

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return router.replace('/login');

    const { data: p, error } = await supabase
      .from('profiles')
      .select('role, full_name, avatar_url')
      .eq('id', user.id)
      .single();

    if (error || !p) {
      console.error('Profile load failed:', error?.message);
      return router.replace('/login');
    }

    setProfile(p);
    setRole(p.role);
    setCollapsed(p.role === 'admin');

    if (p.role === 'admin') {
      const { count } = await supabase
        .from('teacher_requests')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');
      setPendingRequests(count || 0);
    }

    setLoading(false);
  }, [router]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const logout = async () => {
    await supabase.auth.signOut();
    router.replace('/login');
  };

  if (loading || collapsed === null) return <p className="p-6">Loading…</p>;

  return (
    <div className="flex h-screen bg-[#f5f7fa] text-[#0f1f44]">
      {/* Sidebar */}
      <aside className={`${collapsed ? 'w-16' : 'w-64'} bg-gradient-to-b from-[#0f1f44] to-[#163057] text-white p-4 flex flex-col transition-all`}>
        <div className="flex flex-col items-center mb-4">
          <Image src="/logo.png" alt="Logo" width={40} height={40} />
          {!collapsed && <h1 className="text-xl font-bold text-center mt-2">AIELTS Prep</h1>}
        </div>

        <button onClick={() => setCollapsed(!collapsed)} className="text-sm text-white mb-6 hover:text-orange-400">
          {collapsed ? '➡️' : '⬅️ Collapse'}
        </button>

        <nav className="flex-1 space-y-2">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = router.pathname === href;
            return (
              <div key={href} className="relative group">
                <Link
                  href={href}
                  className={`flex items-center px-3 py-2 rounded-l-full transition ${
                    active ? 'bg-[#c59d5f] text-white shadow-inner' : 'hover:bg-[#28527a] hover:text-[#c59d5f]'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {!collapsed && <span className="ml-2">{label}</span>}
                </Link>
                {collapsed && (
                  <span className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 text-xs bg-black text-white rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap z-50">
                    {label}
                  </span>
                )}
              </div>
            );
          })}
        </nav>

        {/* Avatar Section */}
        {!collapsed && (
          <div className="mt-auto text-center">
            <label className="relative inline-block group cursor-pointer">
              <Avatar src={profile?.avatar_url || ''} className="mx-auto h-14 w-14 mb-1" />
              <input
                type="file"
                accept="image/*"
                className="absolute inset-0 opacity-0"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const ext = file.name.split('.').pop();
                  const fileName = `${Date.now()}.${ext}`;
                  const filePath = fileName;

                  const { error: uploadError } = await supabase.storage
                    .from('avatars')
                    .upload(filePath, file);
                  if (uploadError) return console.error(uploadError.message);

                  const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
                  const publicUrl = data?.publicUrl;

                  const { data: { user } } = await supabase.auth.getUser();
                  if (user) {
                    await supabase.from('profiles').update({ avatar_url: publicUrl }).eq('id', user.id);
                    window.location.reload();
                  }
                }}
              />
              <span className="text-xs text-[#c59d5f] absolute -bottom-5 left-1/2 -translate-x-1/2 group-hover:underline">
                Change
              </span>
            </label>
            <p className="text-sm font-medium mt-2">{profile?.full_name || 'User'}</p>
            <p className="text-xs bg-[#c59d5f] text-white inline-block px-2 py-0.5 rounded-full capitalize mt-1">
              {role}
            </p>
            <button
              onClick={logout}
              className="mt-3 text-sm text-[#c59d5f] hover:underline flex items-center justify-center"
            >
              <LogOut className="h-4 w-4 mr-1" /> Logout
            </button>
          </div>
        )}
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto p-8">
        <div className="sticky top-0 z-10 bg-[#f5f7fa] pb-2">
          <Breadcrumb />
        </div>
        {children}
      </main>

      {/* Right Panel */}
      {!collapsed && (
        <aside className="w-72 bg-white border-l shadow-lg p-6">
          {role === 'admin' ? (
            <>
              <h3 className="text-lg font-semibold mb-3">Admin Panel</h3>
              <div className="space-y-3 text-sm">
                <Link href="/adminDashboard" className="block px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded">🛠 Full Admin Panel</Link>
                <Link href="/admin/users" className="block px-4 py-2 bg-red-100 hover:bg-red-200 text-red-800 rounded">👥 Manage Users</Link>
                <Link href="/admin/teacher-requests" className="block px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded flex justify-between">
                  📩 Review Requests
                  {pendingRequests > 0 && (
                    <span className="ml-2 bg-red-600 text-white text-xs px-2 py-0.5 rounded-full">{pendingRequests}</span>
                  )}
                </Link>
                <Link href="/admin/pdf-importer" className="block px-4 py-2 bg-indigo-100 hover:bg-indigo-200 rounded">📘 Upload Reading</Link>
                <Link href="/admin/reading-library" className="block px-4 py-2 bg-green-100 hover:bg-green-200 rounded">📚 Reading Library</Link>
                <Link href="/admin/manual-upload" className="block px-4 py-2 bg-yellow-100 hover:bg-yellow-200 rounded">🔼 Manual Upload</Link>
              </div>
            </>
          ) : (
            <>
              <h3 className="text-lg font-semibold mb-4">Free IELTS Lessons</h3>
              <SubscribeForm />
            </>
          )}
        </aside>
      )}
    </div>
  );
}
