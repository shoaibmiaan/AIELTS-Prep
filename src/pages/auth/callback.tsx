import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../context/AuthContext';

export default function AuthCallback() {
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (user) router.push('/dashboard');
  }, [user]);

  return <div>Loading...</div>;
}