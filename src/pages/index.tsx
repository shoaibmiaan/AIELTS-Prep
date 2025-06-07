import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function Home() {
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    setSession(supabase.auth.session());
    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      {session ? (
        <p>Welcome, {session.user.email}</p>
      ) : (
        <a href="/login" className="text-blue-600">Log in</a>
      )}
    </div>
  );
}
