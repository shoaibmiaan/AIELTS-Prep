import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '@/lib/supabaseClient';

const LibraryPage = () => {
  const router = useRouter();
  const { module } = router.query;  // Fetch the 'module' query parameter
  const [availableTests, setAvailableTests] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (module) {
      setLoading(true);  // Show loading while fetching tests

      // Fetch the tests from Supabase for the selected module
      const fetchTests = async () => {
        try {
          const { data, error } = await supabase
            .from('reading_papers')  // Fetch the relevant table
            .select('*');

          if (error) throw error;
          setAvailableTests(data || []);
        } catch (error) {
          console.error('Error fetching tests:', error);
        } finally {
          setLoading(false);  // Stop loading after fetching
        }
      };

      fetchTests();
    }
  }, [module]);  // Re-run effect when `module` changes

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>{module} Practice Tests</h1>
      {availableTests.length === 0 ? (
        <p>No tests available for {module}.</p>
      ) : (
        <ul>
          {availableTests.map((test) => (
            <li key={test.id} onClick={() => router.push(`/assessmentRoom/reading/${test.id}`)}>
              {test.title}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LibraryPage;
