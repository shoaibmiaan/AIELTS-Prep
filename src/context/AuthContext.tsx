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
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{ data?: any; error?: any }>;
  signInWithGoogle: () => Promise<void>;
  signInWithFacebook: () => Promise<void>;
  logout: () => void;
  updateUser: (userData: User) => void;
  profile: any; // Profile data
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any>(null); // Profile state
  const [loading, setLoading] = useState(true);

  // 1. Initialize user session
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data: { user: authUser }, error } = await supabase.auth.getUser();

        if (error || !authUser) {
          setUser(null);
          return;
        }

        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', authUser.id)
          .single();

        setUser({
          id: authUser.id,
          email: authUser.email,
          name: profileData?.full_name,
          targetBand: profileData?.target_band,
          avatar: profileData?.avatar_url,
          membership: profileData?.role,
          access_token: authUser.access_token,
        });

        setProfile(profileData); // Set profile data
      } catch (err) {
        toast.error('Session loading failed');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();

    // 2. Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          await fetchUser();
        } else {
          setUser(null);
          setProfile(null); // Reset profile when logged out
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // 3. Email/Password Login
  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;
      return { data };
    } catch (error: any) {
      toast.error(error.message || 'Login failed');
      return { error };
    } finally {
      setLoading(false);
    }
  };

  // 4. Social Logins
  const signInWithGoogle = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });
      if (error) throw error;
    } catch (error: any) {
      toast.error(error.message || 'Google login failed');
    }
  };

  const signInWithFacebook = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'facebook',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });
      if (error) throw error;
    } catch (error: any) {
      toast.error(error.message || 'Facebook login failed');
    }
  };

  // 5. Logout
  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      window.location.href = '/login';
    } catch (error: any) {
      toast.error(error.message || 'Logout failed');
    }
  };

  // 6. Update User Profile
  const updateUser = async (userData: User) => {
    if (!user?.id) return;

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
        })
        .eq('id', user.id);

      if (error) throw error;

      setUser(prev => ({
        ...prev,
        name: userData.name,
        targetBand: userData.targetBand,
        avatar: userData.avatar,
      }));
      setProfile(prev => ({
        ...prev,
        full_name: userData.name,
        target_band: userData.targetBand,
        avatar_url: userData.avatar,
        first_name: userData.firstName,
        last_name: userData.lastName,
        country: userData.country,
        level: userData.level,
      }));

      toast.success('Profile updated!');
    } catch (error: any) {
      toast.error(error.message || 'Update failed');
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
        profile // Provide profile data
      }}
    >
      {!loading && children}
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
