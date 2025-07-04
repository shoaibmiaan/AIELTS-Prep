'use client';

import React, { useEffect, useState, ReactNode, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { supabase } from '@/lib/supabaseClient';
import { Home, Headphones, BookOpen, Edit3, Mic, Activity, LogOut } from 'lucide-react';
import Avatar from '@/components/Avatar';
import SubscribeForm from '@/components/SubscribeForm';
import Breadcrumb from '@/components/Breadcrumb';

type Profile = { role: string; full_name: string; avatar_url?: string };

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: Home },
  { href: '/practice/listening', label: 'Listening', icon: Headphones },
  { href: '/practice/reading', label: 'Reading', icon: BookOpen },
  { href: '/practice/writing/writing-instructions', label: 'Writing', icon: Edit3 },
  { href: '/practice/speaking/speaking', label: 'Speaking', icon: Mic },
  { href: '/exercises', label: 'Exercises', icon: Activity },
];

export default function Layout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [role, setRole] = useState('');
  const [loading, setLoading] = useState(true);
  const [collapsed, setCollapsed] = useState<boolean | null>(null);
  const [pendingRequests, setPendingRequests] = useState(0);

  const loadProfile = useCallback(async () => {
    const publicRoutes = ['/login', '/signup', '/reset-password'];
    const currentPath = router.pathname;

    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      if (publicRoutes.includes(currentPath)) {
        setLoading(false);
        return;
      } else {
        return router.replace('/login');
      }
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      if (publicRoutes.includes(currentPath)) {
        setLoading(false);
        return;
      } else {
        return router.replace('/login');
      }
    }

    const { data: p, error } = await supabase
      .from('profiles')
      .select('role, full_name, avatar_url')
      .eq('id', user.id)
      .single();

    if (error || !p) return router.replace('/login');

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
    <div className="flex h-screen bg-[#f8f9fa] text-[#0f1f44]">
      {/* Sidebar */}
      <aside className={`transition-all duration-300 ${collapsed ? 'w-16' : 'w-64'} bg-[#1E1F25] text-white p-4 flex flex-col`}>
        <div className="flex items-center justify-center mb-6">
          <Image src="/logo.png" alt="Logo" width={32} height={32} />
          {!collapsed && <span className="ml-2 font-semibold text-lg">AIELTS <span className="text-orange-400">Prep</span></span>}
        </div>
        <button onClick={() => setCollapsed(prev => !prev)} className="text-white hover:text-orange-400 mb-6" title="Toggle Sidebar">
          {collapsed ? '➡️' : '⬅️'}
        </button>
        <nav className="flex-1 space-y-2">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = router.pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center px-3 py-2 rounded-xl transition ${active ? 'bg-orange-500 text-white' : 'hover:bg-[#2a2b30] hover:text-orange-400'}`}
              >
                <Icon className="h-5 w-5" />
                {!collapsed && <span className="ml-2">{label}</span>}
              </Link>
            );
          })}
        </nav>

        {!collapsed && profile && (
          <div className="mt-auto text-center">
            <label className="cursor-pointer relative group inline-block">
              <Avatar src={profile?.avatar_url || ''} className="mx-auto h-14 w-14 mb-1" />
              <input type="file" accept="image/*" className="absolute inset-0 opacity-0" />
              <span className="text-xs absolute -bottom-5 left-1/2 -translate-x-1/2 text-orange-400 group-hover:underline">Change</span>
            </label>
            <p className="text-sm mt-2">{profile?.full_name || 'User'}</p>
            <p className="text-xs bg-orange-500 text-white inline-block px-2 py-0.5 rounded-full mt-1 capitalize">{role}</p>
            <button onClick={logout} className="mt-3 text-sm text-orange-400 hover:underline flex items-center justify-center">
              <LogOut className="h-4 w-4 mr-1" /> Logout
            </button>
          </div>
        )}
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto bg-white">
        <div className="sticky top-0 z-40 bg-[#1E1F25] text-white px-6 py-3 border-b border-gray-700 flex items-center justify-between">
          <h1 className="text-lg font-bold">AIELTS <span className="text-orange-400">Prep</span></h1>
          <Breadcrumb />
        </div>
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
