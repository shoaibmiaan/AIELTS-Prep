// src/pages/signup.tsx
import React, { useState, FormEvent } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { supabase } from '@/lib/supabaseClient'

type Role = 'student' | 'teacher'

export default function SignUpPage() {
  const router = useRouter()
  const [role, setRole] = useState<Role>('student')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [submissionStatus, setSubmissionStatus] = useState<'pending' | 'emailSent' | null>(null)

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [yearOfEducation, setYearOfEducation] = useState('')
  const [subject, setSubject] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')

  const roleLabel = role === 'student' ? 'Student' : 'Teacher'

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    if (password !== confirm) {
      setError("Passwords don't match")
      return
    }

    setLoading(true)
    try {
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { role, first_name: firstName, last_name: lastName },
        },
      })
      if (signUpError) throw signUpError

      // If your Supabase requires email confirmation, user object isn't returned until verified
      if (!authData.user) {
        setSubmissionStatus('emailSent')
        return
      }

      // Insert into profiles
      const profile = {
        id: authData.user.id,
        email,
        role,
        first_name: firstName,
        last_name: lastName,
        ...(role === 'student' ? { year_of_education: yearOfEducation } : {}),
        status: role === 'teacher' ? 'pending' : 'active',
        ...(role === 'teacher' ? { subject } : {}),
      }
      const { error: profileError } = await supabase.from('profiles').insert(profile)
      if (profileError) throw profileError

      if (role === 'teacher') setSubmissionStatus('pending')
      else router.push('/profile')
    } catch (err) {
      console.error(err)
      setError((err as Error).message || 'An unknown error occurred.')
    } finally {
      setLoading(false)
    }
  }

  if (submissionStatus === 'emailSent') {
    return (
      <div className="max-w-md mx-auto mt-12 p-6 bg-white rounded shadow text-center">
        <h1 className="text-2xl font-semibold mb-4">Check Your Email</h1>
        <p className="mb-4">
          A confirmation link has been sent to {email}. Please confirm to complete sign-up.
        </p>
        <Link href="/login" className="text-blue-600 hover:underline">Back to Log In</Link>
      </div>
    )
  }

  if (submissionStatus === 'pending') {
    return (
      <div className="max-w-md mx-auto mt-12 p-6 bg-white rounded shadow text-center">
        <h1 className="text-2xl font-semibold mb-4">Thank you!</h1>
        <p className="mb-4">
          Your teacher account is pending approval by the administrator.
          You will receive an email once it’s approved.
        </p>
        <Link href="/login" className="text-blue-600 hover:underline">Back to Log In</Link>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto mt-12 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-semibold mb-4">Sign Up</h1>
      <div className="flex mb-6">
        <button
          type="button"
          onClick={() => setRole('student')}
          className={`flex-1 py-2 rounded-l ${role === 'student' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Student
        </button>
        <button
          type="button"
          onClick={() => setRole('teacher')}
          className={`flex-1 py-2 rounded-r ${role === 'teacher' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Teacher
        </button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="firstName" className="block font-medium">First Name</label>
          <input
            id="firstName"
            type="text"
            required
            value={firstName}
            onChange={e => setFirstName(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label htmlFor="lastName" className="block font-medium">Last Name</label>
          <input
            id="lastName"
            type="text"
            required
            value={lastName}
            onChange={e => setLastName(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        {role === 'student' && (
          <div>
            <label htmlFor="yearOfEducation" className="block font-medium">Year of Education</label>
            <input
              id="yearOfEducation"
              type="text"
              required
              value={yearOfEducation}
              onChange={e => setYearOfEducation(e.target.value)}
              placeholder="e.g. 1st Year, 2025"
              className="w-full border rounded px-3 py-2"
            />
          </div>
        )}

        {role === 'teacher' && (
          <div>
            <label htmlFor="subject" className="block font-medium">Subject Expertise</label>
            <input
              id="subject"
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
          <label htmlFor="email" className="block font-medium">Email</label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label htmlFor="password" className="block font-medium">Password</label>
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label htmlFor="confirm" className="block font-medium">Confirm Password</label>
          <input
            id="confirm"
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
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:opacity-50"
        >
          {loading ? 'Registering…' : `Sign Up as ${roleLabel}`}
        </button>
      </form>
      <p className="mt-4 text-center text-sm">
        Already have an account?{' '}
        <Link href="/login" className="text-blue-600 hover:underline">Log In</Link>
      </p>
    </div>
  )
}
