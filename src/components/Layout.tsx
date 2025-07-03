'use client';

import React, { ReactNode, useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image'; // <-- FIXED: Import Image
import { useRouter } from 'next/router';
import { supabase } from '../lib/supabaseClient';
import { Home, Headphones, BookOpen, Edit3, Mic, Activity, LogOut } from 'lucide-react';
import Avatar from './Avatar';
import SubscribeForm from '@/components/SubscribeForm';
import Breadcrumb from './Breadcrumb';

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
    if (!user) return router.replace('/login'); // ✅ prevent null.id error

    const { data: p, error: profileError } = await supabase
      .from('profiles')
      .select('role, full_name, avatar_url')
      .eq('id', user.id)
      .single();

    if (profileError || !p) {
      console.error('Failed to load profile:', profileError?.message);
      return router.replace('/login');
    }

    setProfile(p);
    setRole(p.role);

    if (p.role === 'admin') {
      setCollapsed(true);
      const { count } = await supabase
        .from('teacher_requests')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');
      setPendingRequests(count || 0);
    } else {
      setCollapsed(false);
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
      <aside className={`${collapsed ? 'w-16' : 'w-64'} transition-all duration-300 bg-gradient-to-b from-[#0f1f44] to-[#163057] p-4 flex flex-col`}>
        <div className="flex flex-col items-center mb-4">
          <Image src="/logo.png" alt="Logo" className="mb-2" width={40} height={40} /> {/* <-- FIXED */}
          {!collapsed && <h1 className="text-xl font-bold text-white text-center">Learn with Universe</h1>}
        </div>
        <button onClick={() => setCollapsed((prev) => !prev)} className="text-white hover:text-[#c59d5f] mb-6" title="Toggle Sidebar">
          {collapsed ? '➡️' : '⬅️'}
        </button>
        <nav className="flex-1 space-y-2">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = router.pathname === href;
            return (
              <div key={href} className="relative group">
                <Link
                  href={href}
                  className={`flex items-center px-3 py-2 rounded-l-full transition ${active ? 'bg-[#c59d5f] text-white shadow-inner' : 'text-white hover:bg-[#28527a] hover:text-[#c59d5f]'}`}
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

        {/* Avatar + Info */}
        {!collapsed && (
          <div className="mt-auto text-center">
            <label className="cursor-pointer relative group inline-block">
              <Avatar src={profile?.avatar_url || ''} className="mx-auto h-14 w-14 mb-1" />
              <input
                type="file"
                accept="image/*"
                className="absolute inset-0 opacity-0"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;

                  const fileExt = file.name.split('.').pop();
                  const fileName = `${Date.now()}.${fileExt}`;
                  const filePath = `${fileName}`;

                  const { error: uploadError } = await supabase.storage
                    .from('avatars')
                    .upload(filePath, file);

                  if (uploadError) {
                    console.error('Avatar upload failed:', uploadError.message);
                    return;
                  }

                  const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
                  const publicUrl = data?.publicUrl;

                  const { data: { user } } = await supabase.auth.getUser();
                  if (!user) return;

                  await supabase
                    .from('profiles')
                    .update({ avatar_url: publicUrl })
                    .eq('id', user.id);

                  window.location.reload();
                }}
              />
              <span className="text-xs absolute -bottom-5 left-1/2 -translate-x-1/2 text-[#c59d5f] group-hover:underline">Change</span>
            </label>
            <p className="text-sm font-medium text-white mt-2">{profile?.full_name || 'User'}</p>
            <p className="text-xs text-white bg-[#c59d5f] inline-block px-2 py-0.5 rounded-full capitalize mt-1">
              {role} account
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
        <div className="sticky top-0 z-20 bg-[#f5f7fa] pb-2">
          <Breadcrumb />
        </div>
        {children}
      </main>

      {/* Right Panel */}
      {!collapsed && (
        <aside className="w-64 bg-white border-l shadow-lg p-6">
          {role === 'admin' ? (
            <>
              <h3 className="text-lg font-semibold mb-2">Admin Dashboard</h3>
              <p className="text-sm text-gray-600 mb-4">Manage users and review teacher access requests.</p>
              <div className="space-y-3">
                <Link href="/adminDashboard" className="block w-full text-left px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded font-medium">🛠️ Full Admin Panel</Link>
                <Link href="/admin/users" className="block w-full text-left px-4 py-2 bg-red-100 hover:bg-red-200 text-red-800 rounded font-medium">👥 Manage Users</Link>
                <Link href="/admin/teacher-requests" className="block w-full text-left px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded font-medium flex justify-between">
                  <span>📩 Review Requests</span>
                  {pendingRequests > 0 && (
                    <span className="ml-2 bg-red-600 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                      {pendingRequests}
                    </span>
                  )}
                </Link>
                <Link href="/admin/pdf-importer" className="block w-full text-left px-4 py-2 bg-indigo-100 hover:bg-indigo-200 text-indigo-800 rounded font-medium">📘 Upload Reading</Link>
                <Link href="/admin/reading-library" className="block w-full text-left px-4 py-2 bg-green-100 hover:bg-green-200 text-green-800 rounded font-medium">📚 Reading Library</Link>
                <Link href="/admin/manual-upload" className="block w-full text-left px-4 py-2 bg-yellow-100 hover:bg-yellow-200 text-yellow-800 rounded font-medium">🔼 Manual Upload</Link>
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
