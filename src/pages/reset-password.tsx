// pages/reset-password.tsx
import { useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '@/lib/supabaseClient';
import toast from 'react-hot-toast';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const router = useRouter();

  const handleReset = async () => {
    if (password !== confirm) {
      toast.error("Passwords don't match");
      return;
    }

    const { error } = await supabase.auth.updateUser({ password });
    if (error) return toast.error(error.message);

    toast.success('Password updated!');
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-gray-900 p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-4">Reset Your Password</h1>
        <input
          type="password"
          placeholder="New password"
          className="w-full mb-4 px-3 py-2 rounded bg-gray-800 border border-gray-700"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="Confirm new password"
          className="w-full mb-6 px-3 py-2 rounded bg-gray-800 border border-gray-700"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
        />
        <button
          onClick={handleReset}
          className="w-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600"
        >
          Reset Password
        </button>
      </div>
    </div>
  );
}
