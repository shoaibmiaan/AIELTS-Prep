import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      console.log("Logged in user:", user?.id);

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      console.log("Fetched profile:", data); // 🔍 Debug log
      if (!error) setProfile(data);
      setLoading(false);
    };
    fetchProfile();
  }, []);

  const handleRoleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newRole = e.target.value;
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

  if (loading) return <div className="p-4">Loading profile...</div>;

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow mt-10">
      <h1 className="text-xl font-bold mb-4">Your Profile</h1>
      <p><strong>Email:</strong> {profile.email}</p>
      <p><strong>Joined:</strong> {new Date(profile.created_at).toLocaleString()}</p>
      <p className="mt-4">
        <strong>Role:</strong>
        {profile.role === 'admin' ? (
          <select value={profile.role} onChange={handleRoleChange} className="ml-2 border px-2 py-1">
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
            <option value="admin">Admin</option>
          </select>
        ) : (
          <span className="ml-2">{profile.role}</span>
        )}
      </p>
    </div>
  );
}
