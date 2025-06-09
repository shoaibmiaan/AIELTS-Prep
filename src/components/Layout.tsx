// src/components/Layout.tsx
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { supabase } from '../lib/supabaseClient';

type Profile = {
  role: string;
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        router.replace('/login');
        return;
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (!error && data) {
        setProfile(data);
      } else {
        console.error('Error fetching profile:', error?.message);
      }
    };

    fetchProfile();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  if (profile === null) {
    return <div className="p-4 text-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="bg-white shadow p-4 flex justify-between items-center">
        <div className="space-x-4">
          <Link href="/dashboard" className="hover:underline">
            Dashboard
          </Link>
          <Link href="/profile" className="hover:underline">
            Profile
          </Link>

          {profile.role === 'admin' && (
            <>
              <Link href="/admin/teacher-requests" className="hover:underline">
                Teacher Requests
              </Link>
              <Link href="/admin/users" className="hover:underline">
                Manage Users
              </Link>
            </>
          )}
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-500">
            Role: <strong>{profile.role}</strong>
          </span>
          <button
            onClick={handleLogout}
            className="text-red-500 hover:underline"
          >
            Logout
          </button>
        </div>
      </nav>
      <main className="flex-1 bg-gray-50">{children}</main>
    </div>
  );
}
