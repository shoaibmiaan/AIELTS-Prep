import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import LoginForm from '@/components/auth/LoginForm';
import { useAuth } from '@/context/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const sectionVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.3, delay: 0.1 } },
};

export default function LoginPage() {
  const { user } = useAuth();
  const router = useRouter();

  // Redirect if already logged in
  useEffect(() => {
    if (user) router.push('/');
  }, [user, router]);

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-gradient-to-br from-[rgb(var(--color-secondary))] to-[rgb(var(--color-primary))] dark:from-[rgb(var(--color-background-dark))] dark:to-[rgb(var(--color-secondary-dark))]">
      {/* Animated Background Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[rgb(var(--color-secondary), 0.1)] to-transparent animate-gradient-move opacity-40"></div>
      <style>
        {`
          @keyframes gradient-move {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          .animate-gradient-move {
            background-size: 200% 200%;
            animation: gradient-move 8s ease infinite;
          }
        `}
      </style>

      <Header className="py-2" />

      <main className="flex-grow flex items-center justify-center p-2 md:p-3 relative z-10">
        <motion.div
          className="max-w-md w-full space-y-4 p-4 md:p-6 bg-[rgb(var(--color-card))] dark:bg-[rgb(var(--color-card-dark))] rounded-xl shadow-md dark:shadow-lg border dark:border-[rgb(var(--color-border-dark))] transition-all hover:shadow-lg"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            className="text-center"
            variants={sectionVariants}
          >
            <div className="mx-auto bg-[rgb(var(--color-secondary), 0.2)] dark:bg-[rgb(var(--color-secondary-dark), 0.2)] p-3 rounded-full w-14 h-14 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[rgb(var(--color-secondary))] dark:text-[rgb(var(--color-secondary-dark))]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <motion.h2
              className="mt-3 text-2xl md:text-3xl font-bold text-[rgb(var(--color-foreground))] dark:text-[rgb(var(--color-foreground-dark))]"
              variants={cardVariants}
            >
              Welcome to IELTS Master
            </motion.h2>
            <motion.p
              className="mt-1 text-sm md:text-base text-[rgb(var(--color-muted))] dark:text-[rgb(var(--color-muted-dark))]"
              variants={cardVariants}
            >
              Sign in to access your personalized dashboard
            </motion.p>
          </motion.div>

          <LoginForm />

          <motion.div
            className="text-center mt-3"
            variants={sectionVariants}
          >
            <p className="text-xs md:text-sm text-[rgb(var(--color-muted))] dark:text-[rgb(var(--color-muted-dark))]">
              Don't have an account? {' '}
              <a
                href="/signup"
                className="font-medium text-[rgb(var(--color-secondary))] dark:text-[rgb(var(--color-secondary-dark))] hover:text-[rgb(var(--color-primary))] dark:hover:text-[rgb(var(--color-primary))] transition-colors"
              >
                Register now
              </a>
            </p>
            <a
              href="/forgot-password"
              className="mt-1 block text-xs md:text-sm text-[rgb(var(--color-secondary))] dark:text-[rgb(var(--color-secondary-dark))] hover:text-[rgb(var(--color-primary))] dark:hover:text-[rgb(var(--color-primary))] transition-colors"
            >
              Forgot your password?
            </a>
          </motion.div>
        </motion.div>
      </main>

      <Footer className="py-2" />
    </div>
  );
}