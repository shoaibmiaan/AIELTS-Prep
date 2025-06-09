// src/pages/signup.tsx

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { supabase } from '@/lib/supabaseClient'

type Role = 'student' | 'teacher'

export default function SignUpPage() {
  const router = useRouter()
  const [role, setRole] = useState<Role>('student')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [submissionStatus, setSubmissionStatus] = useState<'pending' | null>(null)

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [yearOfEducation, setYearOfEducation] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [subject, setSubject] = useState('') // teacher-only

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)

    if (password !== confirm) {
      setError("Passwords don't match")
      return
    }

    setLoading(true)

    try {
      // 1) Create the auth user
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            role,
            first_name: firstName,
            last_name: lastName,
          },
        },
      })

      if (signUpError || !authData?.user) {
        throw new Error(signUpError?.message || 'Signup failed')
      }

      // 2) Insert into 'profiles' table
      const profileData = {
        id: authData.user.id,
        email,
        role,
        first_name: firstName,
        last_name: lastName,
        year_of_education: yearOfEducation,
        status: role === 'teacher' ? 'pending' : 'active',
        ...(role === 'teacher' && { subject }),
      }

      const { error: profileError } = await supabase.from('profiles').insert(profileData)

      if (profileError) throw new Error(profileError.message)

      // 3) Handle post-signup flow
      if (role === 'teacher') {
        setSubmissionStatus('pending')
      } else {
        router.push('/profile')
      }
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred.')
    } finally {
      setLoading(false)
    }
  }

  if (submissionStatus === 'pending') {
    return (
      <div className="max-w-md mx-auto mt-12 p-6 bg-white rounded shadow text-center">
        <h1 className="text-2xl font-semibold mb-4">Thank you!</h1>
        <p className="mb-4">
          Your teacher account is pending approval by the administrator.
          You will receive an email once it’s approved.
        </p>
        <Link href="/login" className="text-blue-600 hover:underline">
          Back to Log In
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto mt-12 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-semibold mb-4">Sign Up</h1>

      <div className="flex mb-6">
        <button
          type="button"
          className={`flex-1 py-2 rounded-l ${
            role === 'student' ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}
          onClick={() => setRole('student')}
        >
          Student
        </button>
        <button
          type="button"
          className={`flex-1 py-2 rounded-r ${
            role === 'teacher' ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}
          onClick={() => setRole('teacher')}
        >
          Teacher
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">First Name</label>
          <input
            type="text"
            required
            value={firstName}
            onChange={e => setFirstName(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block font-medium">Last Name</label>
          <input
            type="text"
            required
            value={lastName}
            onChange={e => setLastName(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block font-medium">Year of Education</label>
          <input
            type="text"
            required
            value={yearOfEducation}
            onChange={e => setYearOfEducation(e.target.value)}
            placeholder="e.g. 1st Year, 2025"
            className="w-full border rounded px-3 py-2"
          />
        </div>

        {role === 'teacher' && (
          <div>
            <label className="block font-medium">Subject Expertise</label>
            <input
              type="text"
              required
              value={subject}
              onChange={e => setSubject(e.target.value)}
              placeholder="e.g. Mathematics, English Literature"
              className="w-full border rounded px-3 py-2"
            />
          </div>
        )}

        <div>
          <label className="block font-medium">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block font-medium">Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block font-medium">Confirm Password</label>
          <input
            type="password"
            required
            value={confirm}
            onChange={e => setConfirm(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        {error && <p className="text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          {loading
            ? 'Registering…'
            : `Sign Up as ${role.charAt(0).toUpperCase() + role.slice(1)}`}
        </button>
      </form>

      <p className="mt-4 text-center text-sm">
        Already have an account?{' '}
        <Link href="/login" className="text-blue-600 hover:underline">
          Log In
        </Link>
      </p>
    </div>
  )
}
