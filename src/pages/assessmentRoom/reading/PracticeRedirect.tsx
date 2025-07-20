import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '@/lib/supabaseClient';

export default function PracticeRedirect() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAndRedirect = async () => {
      try {
        const { data, error } = await supabase.from('reading_papers').select('id');
        if (error) throw error;

        if (!data || data.length === 0) {
          setError('No tests available.');
          return;
        }

        const randomTestId = data[Math.floor(Math.random() * data.length)].id;
        router.push(`/assessmentRoom/reading/${randomTestId}`);
      } catch (error: any) {
        setError('Error fetching tests: ' + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAndRedirect();
  }, [router]);

  if (loading) {
    return <div>Loading test...</div>; // You could replace this with a spinner for better UX
  }

  if (error) {
    return <div>{error}</div>; // Display error message if there was an issue
  }

  return null; // Nothing to display once redirect happens
}
