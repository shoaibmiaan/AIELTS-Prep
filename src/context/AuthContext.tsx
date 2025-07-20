import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '@/lib/supabaseClient';
import { User, Session } from '@supabase/supabase-js';
import toast from 'react-hot-toast';

interface Profile {
  id: string;
  full_name: string;
  avatar_url: string;
  username: string;
  is_premium: boolean;
  target_band: number;
  status?: 'active' | 'suspended';
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signup: (email: string, password: string, fullName: string) => Promise<void>;
  refreshProfile: () => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const fetchProfile = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      setProfile(data);
      return data;
    } catch (error) {
      console.error('Error fetching profile:', error);
      setProfile(null);
      throw error;
    }
  }, []);

  const initializeAuth = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data: { session }, error } = await supabase.auth.getSession();

      if (error) throw error;

      if (session?.user) {
        setUser(session.user);
        const profileData = await fetchProfile(session.user.id);

        // Check if account is suspended
        if (profileData?.status === 'suspended') {
          await supabase.auth.signOut();
          throw new Error('Account suspended. Please contact support.');
        }
      } else {
        setUser(null);
        setProfile(null);
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
      if (error instanceof Error) {
        toast.error(error.message);
      }
    } finally {
      setIsLoading(false);
    }
  }, [fetchProfile]);

  useEffect(() => {
    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setUser(session.user);
          const profileData = await fetchProfile(session.user.id);

          // Handle account suspension
          if (profileData?.status === 'suspended') {
            await supabase.auth.signOut();
            toast.error('Account suspended. Please contact support.');
            return;
          }

          if (event === 'SIGNED_IN') {
            const redirectUrl = sessionStorage.getItem('redirectUrl') || '/';
            sessionStorage.removeItem('redirectUrl');
            await router.push(redirectUrl);
          }
        } else {
          setUser(null);
          setProfile(null);
          if (event === 'SIGNED_OUT') {
            await router.push('/login');
          }
        }
        setIsLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, [fetchProfile, initializeAuth, router]);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password
      });

      if (error) throw error;

      if (!data.user?.email_confirmed_at) {
        await supabase.auth.resend({
          type: 'signup',
          email: email.trim().toLowerCase(),
          options: { emailRedirectTo: `${window.location.origin}/auth/confirm` }
        });
        throw new Error('Please verify your email. A new confirmation link has been sent.');
      }

      const profileData = await fetchProfile(data.user.id);

      if (profileData?.status === 'suspended') {
        await supabase.auth.signOut();
        throw new Error('Account suspended. Please contact support.');
      }

      toast.success('Logged in successfully!');
    } catch (error) {
      let message = 'Login failed. Please try again.';

      if (error instanceof Error) {
        if (error.message.includes('Invalid login credentials')) {
          message = 'Incorrect email or password';
        } else if (error.message.includes('Email rate limit exceeded')) {
          message = 'Too many attempts. Please try again later.';
        }
        console.error('Login error:', error);
      }

      toast.error(message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, password: string, fullName: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/confirm`,
          data: {
            full_name: fullName,
            username: email.split('@')[0]
          }
        }
      });

      if (error) throw error;

      if (!data.user?.email_confirmed_at) {
        toast.success('Check your email for confirmation!');
      }

      // Create profile in public.profiles table
      if (data.user) {
        await supabase
          .from('profiles')
          .upsert({
            id: data.user.id,
            full_name: fullName,
            username: email.split('@')[0],
            is_premium: false,
            target_band: 6.5,
            status: 'active'
          });
      }
    } catch (error) {
      let message = 'Signup failed. Please try again.';

      if (error instanceof Error) {
        if (error.message.includes('User already registered')) {
          message = 'Email already in use. Try logging in instead.';
        }
        console.error('Signup error:', error);
      }

      toast.error(message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await supabase.auth.signOut();
      toast.success('Logged out successfully');
      await router.push('/login');
    } catch (error) {
      toast.error('Logout failed. Please try again.');
      console.error('Logout error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user.id);
    }
  };

  const sendPasswordReset = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
        redirectTo: `${window.location.origin}/reset-password`
      });

      if (error) throw error;
      toast.success('Password reset link sent to your email!');
    } catch (error) {
      toast.error('Failed to send reset link. Please try again.');
      console.error('Password reset error:', error);
      throw error;
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;
      setProfile(data);
      toast.success('Profile updated successfully!');
      return data;
    } catch (error) {
      toast.error('Failed to update profile. Please try again.');
      console.error('Profile update error:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      profile,
      isLoading,
      login,
      logout,
      signup,
      refreshProfile,
      sendPasswordReset,
      updateProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
