import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

const StudyStreak = () => {
  const [streakCount, setStreakCount] = useState<number>(0);
  const [flames, setFlames] = useState<JSX.Element[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch streakCount from the profiles table
  useEffect(() => {
    const fetchStreakCount = async () => {
      try {
        const { data: user, error: userError } = await supabase.auth.getUser();
        if (userError) {
          throw userError;
        }

        if (user) {
          // Fetch the streak count from the profiles table based on the logged-in user's email
          const { data, error } = await supabase
            .from('profiles')  // Ensure you're querying the profiles table
            .select('streak_count')
            .eq('email', user.email)
            .single();  // Use .single() to get one row for the user

          if (error) {
            throw error;
          }

          if (data) {
            setStreakCount(data.streak_count);  // Set streak count from profiles table
          } else {
            setError('Streak data not found');
          }
        } else {
          setError('User not authenticated');
        }
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStreakCount();
  }, []);

  // Update flames display based on streakCount
  useEffect(() => {
    const newFlames = [];
    for (let i = 0; i < streakCount; i++) {
      newFlames.push(
        <div key={i} className="text-yellow-500">
          🔥
        </div>
      );
    }
    setFlames(newFlames);
  }, [streakCount]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="flex items-center bg-orange-50 px-3 py-2 rounded-lg border border-orange-200">
      <span className="mr-2 font-medium">Streak:</span>
      <div className="flex space-x-1">
        {flames.length > 0 ? flames : <span className="text-gray-400">No active streak</span>}
      </div>
      <span className="ml-2 font-bold">{streakCount} days</span>
    </div>
  );
};

export default StudyStreak;
