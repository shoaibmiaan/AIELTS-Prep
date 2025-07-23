'use client';
import { useState } from 'react';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import { supabase } from '@/lib/supabaseClient';

interface LoginModalProps {
  showLoginModal: boolean;
  setShowLoginModal: (show: boolean) => void;
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  handleLogin: () => Promise<void>;
  handleFreePlan: () => void;
}

export default function LoginModal({
  showLoginModal,
  setShowLoginModal,
  email,
  setEmail,
  password,
  setPassword,
  handleLogin,
  handleFreePlan,
}: LoginModalProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isPasswordResetSent, setIsPasswordResetSent] = useState(false);

  if (!showLoginModal) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await handleLogin();
      setShowLoginModal(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed. Please try again.');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!email) {
      toast.error('Please enter your email first');
      return;
    }

    try {
      setIsLoading(true);
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      setIsPasswordResetSent(true);
      toast.success('Password reset link sent to your email!');
    } catch (err) {
      toast.error('Failed to send reset link. Please try again.');
      console.error('Password reset error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-[rgb(var(--color-background-dark)/0.5)] flex items-center justify-center z-50 p-4">
      <div className="bg-[rgb(var(--color-background))] dark:bg-[rgb(var(--color-card-dark))] p-8 rounded-lg max-w-md w-full shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold dark:text-[rgb(var(--color-foreground-dark))]">Welcome to IELTSMaster</h2>
          <button
            onClick={() => {
              setShowLoginModal(false);
              setError('');
            }}
            className="text-[rgb(var(--color-muted))] dark:text-[rgb(var(--color-muted-dark))] hover:text-[rgb(var(--color-foreground))] dark:hover:text-[rgb(var(--color-foreground-dark))]"
            disabled={isLoading}
          >
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="mb-6">
          <div className="flex border-b dark:border-[rgb(var(--color-border-dark))]">
            <button className="flex-1 py-2 font-medium text-[rgb(var(--color-primary))] border-b-2 border-[rgb(var(--color-primary))]">
              Sign In
            </button>
            <button
              className="flex-1 py-2 font-medium text-[rgb(var(--color-muted))] dark:text-[rgb(var(--color-muted-dark))]"
              onClick={() => router.push('/signup')}
              disabled={isLoading}
            >
              Sign Up
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-[rgb(var(--color-muted))] dark:text-[rgb(var(--color-muted-dark))] mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full px-3 py-2 border rounded-md dark:bg-[rgb(var(--color-background-dark))] dark:border-[rgb(var(--color-border-dark))] dark:text-[rgb(var(--color-foreground-dark))]"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-[rgb(var(--color-muted))] dark:text-[rgb(var(--color-muted-dark))] mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full px-3 py-2 border rounded-md dark:bg-[rgb(var(--color-background-dark))] dark:border-[rgb(var(--color-border-dark))] dark:text-[rgb(var(--color-foreground-dark))]"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              disabled={isLoading}
            />
          </div>

          {error && (
            <div className="text-[rgb(var(--color-error))] text-sm py-2">
              <i className="fas fa-exclamation-circle mr-2"></i>
              {error}
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-[rgb(var(--color-primary))] focus:ring-[rgb(var(--color-primary))] border-[rgb(var(--color-border))] rounded dark:bg-[rgb(var(--color-background-dark))] dark:border-[rgb(var(--color-border-dark))]"
                disabled={isLoading}
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-[rgb(var(--color-muted))] dark:text-[rgb(var(--color-muted-dark))]">
                Remember me
              </label>
            </div>
            <button
              type="button"
              onClick={handlePasswordReset}
              className="text-sm text-[rgb(var(--color-primary))] dark:text-[rgb(var(--color-primary))] hover:underline"
              disabled={isLoading || isPasswordResetSent}
            >
              {isPasswordResetSent ? 'Reset link sent!' : 'Forgot password?'}
            </button>
          </div>

          <button
            type="submit"
            className={`w-full bg-[rgb(var(--color-primary))] hover:bg-[rgb(var(--color-primary-dark))] text-[rgb(var(--color-foreground-light))] py-2 rounded-md font-medium flex items-center justify-center ${
              isLoading ? 'opacity-75 cursor-not-allowed' : ''
            }`}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <i className="fas fa-spinner fa-spin mr-2"></i>
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[rgb(var(--color-border))] dark:border-[rgb(var(--color-border-dark))]"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-[rgb(var(--color-background))] dark:bg-[rgb(var(--color-card-dark))] text-[rgb(var(--color-muted))] dark:text-[rgb(var(--color-muted-dark))]">
                Or continue with
              </span>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-3">
            <button
              className="w-full inline-flex justify-center py-2 px-4 border border-[rgb(var(--color-border))] dark:border-[rgb(var(--color-border-dark))] rounded-md shadow-sm bg-[rgb(var(--color-background))] dark:bg-[rgb(var(--color-card-dark))] text-sm font-medium text-[rgb(var(--color-muted))] dark:text-[rgb(var(--color-muted-dark))] hover:bg-[rgb(var(--color-card))] dark:hover:bg-[rgb(var(--color-background-dark))]"
              disabled={isLoading}
            >
              <i className="fab fa-google mr-2"></i> Google
            </button>
            <button
              className="w-full inline-flex justify-center py-2 px-4 border border-[rgb(var(--color-border))] dark:border-[rgb(var(--color-border-dark))] rounded-md shadow-sm bg-[rgb(var(--color-background))] dark:bg-[rgb(var(--color-card-dark))] text-sm font-medium text-[rgb(var(--color-muted))] dark:text-[rgb(var(--color-muted-dark))] hover:bg-[rgb(var(--color-card))] dark:hover:bg-[rgb(var(--color-background-dark))]"
              disabled={isLoading}
            >
              <i className="fab fa-facebook-f mr-2"></i> Facebook
            </button>
          </div>
        </div>

        <div className="mt-6 text-center">
          <button
            className={`text-sm text-[rgb(var(--color-muted))] dark:text-[rgb(var(--color-muted-dark))] font-medium hover:underline ${
              isLoading ? 'cursor-not-allowed opacity-75' : ''
            }`}
            onClick={handleFreePlan}
            disabled={isLoading}
          >
            Continue with free plan
          </button>
        </div>
      </div>
    </div>
  );
}