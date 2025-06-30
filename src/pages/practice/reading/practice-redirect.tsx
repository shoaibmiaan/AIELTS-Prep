'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '@/lib/supabaseClient';

export default function PracticeRedirect() {
  const router = useRouter();

  useEffect(() => {
    const redirect = async () => {
      // Get user id
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.replace('/login');
        return;
      }

      // Fetch all available practice papers
      const { data: papers } = await supabase
        .from('reading_papers')
        .select('id')
        .order('created_at', { ascending: true });

      if (!papers || papers.length === 0) {
        alert('No practice papers found.');
        router.replace('/practice/reading');
        return;
      }

      // Fetch user's attempts on papers
      const { data: attempts } = await supabase
        .from('reading_attempts')
        .select('test_id, created_at')
        .eq('user_id', user.id);

      const attemptedIds = (attempts || []).map(a => a.test_id);

      // Find unattempted papers
      const unattempted = papers.filter(p => !attemptedIds.includes(p.id));
      let targetPaper;
      if (unattempted.length > 0) {
        // Random from unattempted
        targetPaper = unattempted[Math.floor(Math.random() * unattempted.length)];
      } else {
        // First attempted
        targetPaper = papers.find(p => attemptedIds.includes(p.id));
      }

      if (targetPaper) {
        router.replace(`/practice/reading/${targetPaper.id}`);
      } else {
        alert('No paper to show!');
        router.replace('/practice/reading');
      }
    };
    redirect();
  }, [router]);

  return <div className="p-10 text-center">Loading...</div>;
}
