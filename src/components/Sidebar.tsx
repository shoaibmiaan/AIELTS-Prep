import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Home, Headphones, BookOpen, Edit3, Mic, Activity, LogOut } from 'lucide-react';
import Avatar from '@/components/Avatar';
import { useAuthProfile } from '@/hooks/useAuthProfile';
import { supabase } from '@/lib/supabaseClient';

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: Home },
  { href: '/practice/listening', label: 'Listening', icon: Headphones },
  { href: '/practice/reading', label: 'Reading', icon: BookOpen },
  { href: '/practice/writing/writing-instructions', label: 'Writing', icon: Edit3 },
  { href: '/practice/speaking/speaking', label: 'Speaking', icon: Mic },
  { href: '/exercises', label: 'Exercises', icon: Activity },
];

const SIDEBAR_CLASSES = {
  container: (collapsed: boolean) => `transition-all duration-300 ${collapsed ? 'w-16' : 'w-64'} bg-gradient-to-b from-[#0f1f44] to-[#163057] text-white p-4 flex flex-col`,
  logoContainer: 'flex items-center justify-center mb-6',
  logoText: 'ml-2 font-semibold text-lg',
  toggleButton: 'text-white hover:text-orange-400 mb-6',
  nav: 'flex-1 space-y-2',
  navItem: (active: boolean) => `flex items-center px-3 py-2 rounded-xl transition ${active ? 'bg-orange-500 text-white' : 'hover:bg-[#2a2b30] hover:text-orange-400'}`,
  tooltip: 'absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 text-xs bg-black text-white rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap z-50',
  avatarSection: 'mt-auto text-center',
  avatar: 'mx-auto h-14 w-14 mb-1',
  avatarChange: 'text-xs absolute -bottom-5 left-1/2 -translate-x-1/2 text-orange-400 group-hover:underline',
  roleBadge: 'text-xs bg-orange-500 text-white inline-block px-2 py-0.5 rounded-full mt-1 capitalize',
  logoutButton: 'mt-3 text-sm text-orange-400 hover:underline flex items-center justify-center',
};

interface SidebarProps {
  collapsedByDefault?: boolean;
}

export default function Sidebar({ collapsedByDefault = false }: SidebarProps) {
  const router = useRouter();
  const { profile, role, logout, loading } = useAuthProfile();
  const [collapsed, setCollapsed] = useState(collapsedByDefault);

  if (loading) return <p className="p-6">Loading…</p>;

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const ext = file.name.split('.').pop();
    const fileName = `${Date.now()}.${ext}`;
    const filePath = fileName;

    const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file);
    if (uploadError) {
      console.error('Avatar upload failed:', uploadError.message);
      return;
    }

    const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
    const publicUrl = data?.publicUrl;

    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from('profiles').update({ avatar_url: publicUrl }).eq('id', user.id);
      window.location.reload();
    }
  };

  return (
    <aside className={SIDEBAR_CLASSES.container(collapsed)}>
      <div className={SIDEBAR_CLASSES.logoContainer}>
        <Image src="/logo.png" alt="AIELTS Prep Logo" width={32} height={32} />
        {!collapsed && (
          <span className={SIDEBAR_CLASSES.logoText}>
            AIELTS <span className="text-orange-400">Prep</span>
          </span>
        )}
      </div>
      <button
        onClick={() => setCollapsed((prev) => !prev)}
        className={SIDEBAR_CLASSES.toggleButton}
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed ? '➡️' : '⬅️'}
      </button>
      <nav className={SIDEBAR_CLASSES.nav}>
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = router.pathname === href;
          return (
            <div key={href} className="relative group">
              <Link href={href} className={SIDEBAR_CLASSES.navItem(active)}>
                <Icon className="h-5 w-5" />
                {!collapsed && <span className="ml-2">{label}</span>}
              </Link>
              {collapsed && (
                <span className={SIDEBAR_CLASSES.tooltip}>{label}</span>
              )}
            </div>
          );
        })}
        {role === 'admin' && (
          <div className="relative group">
            <Link
              href="/adminDashboard"
              className={SIDEBAR_CLASSES.navItem(router.pathname === '/adminDashboard')}
            >
              <Activity className="h-5 w-5" />
              {!collapsed && <span className="ml-2">Admin Dashboard</span>}
            </Link>
            {collapsed && <span className={SIDEBAR_CLASSES.tooltip}>Admin Dashboard</span>}
          </div>
        )}
      </nav>
      {!collapsed && profile && (
        <div className={SIDEBAR_CLASSES.avatarSection}>
          <label className="cursor-pointer relative group inline-block">
            <Avatar src={profile?.avatar_url || ''} className={SIDEBAR_CLASSES.avatar} />
            <input
              type="file"
              accept="image/*"
              className="absolute inset-0 opacity-0"
              onChange={handleAvatarUpload}
              aria-label="Upload new avatar"
            />
            <span className={SIDEBAR_CLASSES.avatarChange}>Change</span>
          </label>
          <p className="text-sm mt-2">{profile?.full_name || 'User'}</p>
          <p className={SIDEBAR_CLASSES.roleBadge}>{role}</p>
          <button
            onClick={logout}
            className={SIDEBAR_CLASSES.logoutButton}
            aria-label="Log out"
          >
            <LogOut className="h-4 w-4 mr-1" /> Logout
          </button>
        </div>
      )}
    </aside>
  );
}
