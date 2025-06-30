'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/router';
import confetti from 'canvas-confetti';

export default function ThankYouPage() {
  const router = useRouter();

  useEffect(() => {
    // 🎉 Trigger confetti once
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
    });

    // ⏳ Redirect after 3 seconds
    const timeout = setTimeout(() => {
      router.push('/dashboard');
    }, 3000);

    return () => clearTimeout(timeout); // Cleanup
  }, [router]);

  return (
    <div className="p-8 text-center">
      <h1 className="text-3xl font-bold mb-4">🎉 Thank You!</h1>
      <p className="text-lg text-gray-700">You’ve successfully subscribed to Free IELTS Lessons.</p>
      <p className="text-sm mt-4 text-gray-500">Redirecting to dashboard...</p>
    </div>
  );
}
