// src/pages/admin/users.tsx
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '@/lib/supabaseClient'
import Layout from '@/layouts/SidebarLayout';

interface UserProfile {
  id: string
  email: string
  role: string
  created_at: string
}

export default function UsersPage() {
  const router = useRouter()
  const [users, setUsers] = useState<UserProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true)
      try {
        const { data: authData, error: authError } = await supabase.auth.getUser()
        if (authError) throw new Error('Failed to fetch auth data')
        if (!authData.user) {
          router.replace('/login')
          return
        }

        const { data: myProfile, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', authData.user.id)
          .single()
        if (profileError) throw new Error('Failed to fetch user profile')
        if (myProfile.role !== 'admin') {
          router.replace('/login')
          return
        }

        const { data: fetchedUsers, error: usersError } = await supabase
          .from('profiles')
          .select('id, email, role, created_at')
        if (usersError) throw new Error('Failed to fetch users list')

        setUsers(fetchedUsers)
      } catch (err) {
        console.error(err)
        setError((err as Error).message)
      } finally {
        setLoading(false)
      }
    }
    fetchUsers()
  }, [router])

  const handleRoleChange = async (id: string, newRole: string) => {
    try {
      const { error } = await supabase.from('profiles').update({ role: newRole }).eq('id', id)
      if (error) throw error
      setUsers(u => u.map(user => (user.id === id ? { ...user, role: newRole } : user)))
    } catch (err) {
      console.error(err)
      alert('Error updating role')
    }
  }

  return (
    <Layout>
      {loading ? (
        <div className="p-4">Loading users...</div>
      ) : error ? (
        <div className="p-4 text-red-600">{error}</div>
      ) : (
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
              {users.map(u => (
                <tr key={u.id} className="border-t">
                  <td className="p-2 border">{u.email}</td>
                  <td className="p-2 border">
                    <select
                      value={u.role}
                      onChange={e => handleRoleChange(u.id, e.target.value)}
                      className="border rounded px-2 py-1"
                    >
                      <option value="student">Student</option>
                      <option value="teacher">Teacher</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td className="p-2 border">
                    {new Date(u.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Layout>
  )
}
