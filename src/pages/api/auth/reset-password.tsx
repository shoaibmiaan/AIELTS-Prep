import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createPagesBrowserClient();

  useEffect(() => {
    // Check if we have an access token from the URL
    const { access_token, refresh_token, type } = router.query;

    if (type === 'recovery') {
      supabase.auth.setSession({
        access_token: access_token as string,
        refresh_token: refresh_token as string,
      });
    }
  }, [router.query]);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { error } = await supabase.auth.updateUser({ password });

      if (error) throw error;

      setSuccess(true);
      setTimeout(() => router.push('/'), 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="max-w-md w-full p-8 bg-white rounded-lg shadow">
          <h1 className="text-2xl font-bold mb-4">Password Updated</h1>
          <p>Your password has been successfully updated. Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full p-8 bg-white rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-6">Reset Password</h1>

        {error && <div className="mb-4 text-red-500">{error}</div>}

        <form onSubmit={handleResetPassword} className="space-y-4">
          <div>
            <label htmlFor="password" className="block mb-1">New Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  );
}