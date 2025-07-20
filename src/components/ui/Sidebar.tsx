'use client';
import { FC, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Home, Headphones, BookOpen, Edit3, Mic, Activity, LogOut } from 'lucide-react';
import { useRouter } from 'next/router';
import { useUser } from '@/context/UserContext';  // Correct import for UserContext

const SIDEBAR_CLASSES = {
  container: (collapsed: boolean) => `transition-all duration-300 ${collapsed ? 'w-16' : 'w-64'} bg-gradient-to-b from-[#0f1f44] to-[#163057] text-white p-4 flex flex-col`,
  logoContainer: 'flex items-center justify-center mb-6',
  logoText: 'ml-2 font-semibold text-lg',
  navItem: (active: boolean) => `flex items-center px-3 py-2 rounded-xl transition ${active ? 'bg-orange-500 text-white' : 'hover:bg-[#2a2b30] hover:text-orange-400'}`,
  avatarSection: 'mt-auto text-center',
  avatar: 'mx-auto h-14 w-14 mb-1',
  logoutButton: 'mt-3 text-sm text-orange-400 hover:underline flex items-center justify-center',
};

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: Home },
  { href: '/practice/listening', label: 'Listening', icon: Headphones },
  { href: '/practice/reading', label: 'Reading', icon: BookOpen },
  { href: '/practice/speaking', label: 'Speaking', icon: Mic },
  { href: '/practice/writing', label: 'Writing', icon: Edit3 },
];

interface SidebarProps {
  collapsedByDefault?: boolean;
}

const Sidebar: FC<SidebarProps> = ({ collapsedByDefault = false }) => {
  const [collapsed, setCollapsed] = useState(collapsedByDefault);
  const { user, signOut } = useUser();  // Access user and signOut function
  const router = useRouter();

  return (
    <aside className={SIDEBAR_CLASSES.container(collapsed)}>
      <div className={SIDEBAR_CLASSES.logoContainer}>
        <Image src="/logo.png" alt="Logo" width={32} height={32} />
        {!collapsed && <span className={SIDEBAR_CLASSES.logoText}>AIELTS Prep</span>}
      </div>

      <nav className="flex-1 space-y-2">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = router.pathname === href;
          return (
            <Link key={href} href={href}>
              <a className={SIDEBAR_CLASSES.navItem(active)}>
                <Icon className="h-5 w-5" />
                {!collapsed && <span className="ml-2">{label}</span>}
              </a>
            </Link>
          );
        })}
      </nav>

      {/* Profile Section */}
      {!collapsed && user && (
        <div className={SIDEBAR_CLASSES.avatarSection}>
          <Image src={user?.avatar || '/default-avatar.jpg'} alt="User Avatar" width={56} height={56} className={SIDEBAR_CLASSES.avatar} />
          <p>{user?.name || 'User'}</p>
          <button
            onClick={signOut}
            className={SIDEBAR_CLASSES.logoutButton}
          >
            <LogOut className="h-4 w-4 mr-1" /> Logout
          </button>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
