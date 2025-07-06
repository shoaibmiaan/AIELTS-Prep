import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

type Profile = {
  id: string;
  email: string;
  created_at: string;
  role: 'admin' | 'teacher' | 'student' | string;
  goal_band: string;
  country: string;
  level: string;
};

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [goalBand, setGoalBand] = useState<string>('');
  const [country, setCountry] = useState<string>('');
  const [level, setLevel] = useState<string>('');
  const [loading, setLoading] = useState(true);

  // Fetch profile from Supabase
  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      console.log("Logged in user:", user?.id);

      const { data, error } = await supabase
        .from('profiles')
        .select('id, email, created_at, role, goal_band, country, level')
        .eq('id', user?.id)
        .single();

      if (!error && data) {
        setProfile(data);
        setGoalBand(data.goal_band);
        setCountry(data.country);
        setLevel(data.level);
      }
      setLoading(false);
    };
    fetchProfile();
  }, []);

  // Handle role update
  const handleRoleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newRole = e.target.value;
    if (!profile) return;

    const { error } = await supabase
      .from('profiles')
      .update({ role: newRole })
      .eq('id', profile.id);

    if (!error) {
      setProfile({ ...profile, role: newRole });
      alert('Role updated!');
    } else {
      alert('Permission denied or error occurred.');
    }
  };

  // Handle profile field updates
  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    const { error } = await supabase
      .from('profiles')
      .update({ goal_band: goalBand, country, level })
      .eq('id', profile.id);

    if (!error) {
      setProfile({ ...profile, goal_band: goalBand, country, level });
      alert('Profile updated successfully!');
    } else {
      alert('Error updating profile!');
    }
  };

  if (loading) return <div className="p-4">Loading profile...</div>;

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow mt-10">
      <h1 className="text-xl font-bold mb-4">Your Profile</h1>
      <p><strong>Email:</strong> {profile?.email}</p>
      <p><strong>Joined:</strong> {new Date(profile?.created_at || '').toLocaleString()}</p>

      {/* Role Change */}
      <p className="mt-4">
        <strong>Role:</strong>
        {profile?.role === 'admin' ? (
          <select
            value={profile.role}
            onChange={handleRoleChange}
            className="ml-2 border px-2 py-1"
          >
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
            <option value="admin">Admin</option>
          </select>
        ) : (
          <span className="ml-2">{profile?.role}</span>
        )}
      </p>

      {/* Profile Update Form */}
      <form onSubmit={handleProfileUpdate} className="mt-6 space-y-4">
        <div>
          <label className="block text-sm font-medium">Goal Band</label>
          <input
            type="text"
            value={goalBand}
            onChange={(e) => setGoalBand(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Enter your goal band"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Country</label>
          <input
            type="text"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Enter your country"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Level</label>
          <input
            type="text"
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Enter your level (Beginner, Intermediate, Advanced)"
          />
        </div>
        <div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 bg-blue-500 text-white rounded ${loading ? 'opacity-50' : ''}`}
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
