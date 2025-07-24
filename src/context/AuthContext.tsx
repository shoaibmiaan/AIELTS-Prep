import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { createClient } from '@supabase/supabase-js';
import toast from 'react-hot-toast';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface User {
  id?: string;
  email?: string;
  name?: string;
  targetBand?: number;
  membership?: string;
  avatar?: string;
  access_token?: string;
  firstName?: string;
  lastName?: string;
  country?: string;
  level?: string;
  currentStreak?: number;
  longestStreak?: number;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{ data?: any; error?: any }>;
  signInWithGoogle: () => Promise<void>;
  signInWithFacebook: () => Promise<void>;
  logout: () => void;
  updateUser: (userData: User) => void;
  profile: any;
  updateStreak: (newStreak: number) => void;
  isLoading: boolean; // Add loading state
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true); // Renamed to isLoading

  // Initialize user session
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data: { user: authUser }, error } = await supabase.auth.getUser();

        if (error || !authUser) {
          setUser(null);
          setProfile(null);
          setIsLoading(false);
          return;
        }

        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', authUser.id)
          .single();

        const userProfile = {
          id: authUser.id,
          email: authUser.email,
          name: profileData?.full_name,
          targetBand: profileData?.target_band,
          avatar: profileData?.avatar_url,
          membership: profileData?.role,
          access_token: authUser.access_token,
          firstName: profileData?.first_name,
          lastName: profileData?.last_name,
          country: profileData?.country,
          level: profileData?.level,
          currentStreak: profileData?.current_streak || 0,
          longestStreak: profileData?.longest_streak || 0,
        };

        setUser(userProfile);
        setProfile(profileData);
      } catch (err) {
        toast.error('Session loading failed');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setIsLoading(true);
          await fetchUser();
        } else {
          setUser(null);
          setProfile(null);
          setIsLoading(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // Email/Password Login
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      return { data };
    } catch (error: any) {
      toast.error(error.message || 'Login failed');
      return { error };
    } finally {
      setIsLoading(false);
    }
  };

  // Social Logins
  const signInWithGoogle = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: `${window.location.origin}/auth/callback` }
      });
      if (error) throw error;
    } catch (error: any) {
      toast.error(error.message || 'Google login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithFacebook = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'facebook',
        options: { redirectTo: `${window.location.origin}/auth/callback` }
      });
      if (error) throw error;
    } catch (error: any) {
      toast.error(error.message || 'Facebook login failed');
    } finally {
      setIsLoading(false);
    }
  };

  // Logout
  const logout = async () => {
    setIsLoading(true);
    try {
      await supabase.auth.signOut();
      setUser(null);
      setProfile(null);
      window.location.href = '/login';
    } catch (error: any) {
      toast.error(error.message || 'Logout failed');
    } finally {
      setIsLoading(false);
    }
  };

  // Update User Profile
  const updateUser = async (userData: User) => {
    if (!user?.id) return;
    setIsLoading(true);

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: userData.name,
          target_band: userData.targetBand,
          avatar_url: userData.avatar,
          first_name: userData.firstName,
          last_name: userData.lastName,
          country: userData.country,
          level: userData.level,
          current_streak: userData.currentStreak,
          longest_streak: userData.longestStreak,
        })
        .eq('id', user.id);

      if (error) throw error;

      setUser(prev => ({
        ...prev,
        ...userData,
        currentStreak: userData.currentStreak,
        longestStreak: userData.longestStreak,
      }));

      setProfile(prev => ({
        ...prev,
        ...userData,
        full_name: userData.name,
        target_band: userData.targetBand,
        avatar_url: userData.avatar,
        current_streak: userData.currentStreak,
        longest_streak: userData.longestStreak,
      }));

      toast.success('Profile updated!');
    } catch (error: any) {
      toast.error(error.message || 'Update failed');
    } finally {
      setIsLoading(false);
    }
  };

  // Update streak values
  const updateStreak = async (newStreak: number) => {
    if (!user?.id) return;
    setIsLoading(true);

    try {
      // Calculate new longest streak
      const updatedLongestStreak = Math.max(
        profile?.longest_streak || 0,
        newStreak
      );

      const { error } = await supabase
        .from('profiles')
        .update({
          current_streak: newStreak,
          longest_streak: updatedLongestStreak,
        })
        .eq('id', user.id);

      if (error) throw error;

      setUser(prev => ({
        ...prev,
        currentStreak: newStreak,
        longestStreak: updatedLongestStreak,
      }));

      setProfile(prev => ({
        ...prev,
        current_streak: newStreak,
        longest_streak: updatedLongestStreak,
      }));

      toast.success('Streak updated!');
    } catch (error: any) {
      toast.error('Failed to update streak');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        signInWithGoogle,
        signInWithFacebook,
        logout,
        updateUser,
        profile,
        updateStreak,
        isLoading  // Expose loading state
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};