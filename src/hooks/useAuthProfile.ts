import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

interface Profile {
  role: string;
  full_name: string;
  avatar_url?: string;
}

export function useAuthProfile() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [role, setRole] = useState('');
  const [pendingRequests, setPendingRequests] = useState(0);
  const [loading, setLoading] = useState(true);

  const loadProfile = useCallback(async () => {
    const publicRoutes = ['/login', '/signup', '/reset-password'];
    const currentPath = router.pathname;

    const { data: { session } } = await supabase.auth.getSession();
    if (!session && !publicRoutes.includes(currentPath)) {
      router.replace('/login');
      return;
    }

    if (session) {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        if (!publicRoutes.includes(currentPath)) router.replace('/login');
        setLoading(false);
        return;
      }

      const { data: p, error } = await supabase
        .from('profiles')
        .select('role, full_name, avatar_url')
        .eq('id', user.id)
        .single();

      if (error || !p) {
        console.error('Profile load failed:', error?.message);
        router.replace('/login');
        return;
      }

      setProfile(p);
      setRole(p.role);

      if (p.role === 'admin') {
        const { count } = await supabase
          .from('teacher_requests')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'pending');
        setPendingRequests(count || 0);
      }
    }

    setLoading(false);
  }, [router]);

  const logout = async () => {
    await supabase.auth.signOut();
    router.replace('/login');
  };

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  return { profile, role, pendingRequests, loading, logout };
}
