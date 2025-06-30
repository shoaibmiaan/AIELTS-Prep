'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '@/lib/supabaseClient';

export default function TestRedirect() {
  const router = useRouter();

  useEffect(() => {
    const redirect = async () => {
      // Get user id
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.replace('/login');
        return;
      }

      // Fetch all available testIds for live tests
      const { data: tests } = await supabase
        .from('reading_tests')
        .select('id')
        .order('created_at', { ascending: true });

      if (!tests || tests.length === 0) {
        alert('No live tests found.');
        router.replace('/practice/reading');
        return;
      }

      // Fetch user's attempts on tests
      const { data: attempts } = await supabase
        .from('reading_attempts')
        .select('test_id, created_at')
        .eq('user_id', user.id);

      const attemptedIds = (attempts || []).map(a => a.test_id);

      // Find unattempted tests
      const unattempted = tests.filter(t => !attemptedIds.includes(t.id));
      let targetTest;
      if (unattempted.length > 0) {
        // Random from unattempted
        targetTest = unattempted[Math.floor(Math.random() * unattempted.length)];
      } else {
        // First attempted
        targetTest = tests.find(t => attemptedIds.includes(t.id));
      }

      if (targetTest) {
        router.replace(`/practice/reading/${targetTest.id}`);
      } else {
        alert('No test to show!');
        router.replace('/practice/reading');
      }
    };
    redirect();
  }, [router]);

  return <div className="p-10 text-center">Loading...</div>;
}
