import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

interface UserProfile {
  id: string;
  email: string;
  role: string;
  created_at: string;
}

export default function Users() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data: authData, error: authError } = await supabase.auth.getUser();

        if (authError || !authData?.user) {
          alert('Error fetching user authentication data.');
          return;
        }

        setCurrentUser(authData.user);

        const { data: myProfile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', authData.user.id)
          .single();

        if (profileError || myProfile?.role !== 'admin') {
          alert('Access denied: Admin privileges required.');
          return;
        }

        const { data: fetchedUsers, error: usersError } = await supabase
          .from('profiles')
          .select('id, email, role, created_at');

        if (usersError) {
          alert('Error fetching user profiles.');
        } else {
          setUsers(fetchedUsers);
        }

        setLoading(false);
      } catch (error) {
        console.error('Unexpected error:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleRoleChange = async (id: string, newRole: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', id);

      if (error) {
        alert('Error updating role.');
      } else {
        setUsers(prev =>
          prev.map(user => (user.id === id ? { ...user, role: newRole } : user))
        );
      }
    } catch (error) {
      console.error('Unexpected error:', error);
    }
  };

  if (loading) return <div className="p-4">Loading users...</div>;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Admin: Manage Users</h1>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2 border">Email</th>
            <th className="p-2 border">Role</th>
            <th className="p-2 border">Created</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id} className="border-t">
              <td className="p-2 border">{user.email}</td>
              <td className="p-2 border">
                <select
                  value={user.role}
                  onChange={e => handleRoleChange(user.id, e.target.value)}
                >
                  <option value="student">Student</option>
                  <option value="teacher">Teacher</option>
                  <option value="admin">Admin</option>
                </select>
              </td>
              <td className="p-2 border">
                {new Date(user.created_at).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
