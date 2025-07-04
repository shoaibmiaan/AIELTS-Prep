import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleReset = async () => {
    if (!email) {
      toast.error('Please enter your email');
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      toast.error(error.message);
    } else {
      setSent(true);
      toast.success('Password reset email sent!');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-gray-900 p-8 rounded-lg shadow-lg text-center">
        <h1 className="text-2xl font-bold mb-4">Forgot Password</h1>

        {sent ? (
          <div className="space-y-4">
            <p className="text-green-400 text-sm">
              ✅ We've sent you a password reset link.
              <br />
              Check your email to continue.
            </p>
            <button
              className="text-sm text-orange-400 hover:text-orange-300 underline"
              onClick={() => router.push('/login')}
            >
              Return to Login
            </button>
          </div>
        ) : (
          <>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full mb-4 px-3 py-2 rounded bg-gray-800 border border-gray-700 text-white focus:outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button
              onClick={handleReset}
              disabled={loading}
              className="w-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600 disabled:opacity-50"
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
